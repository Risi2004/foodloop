"""
FastAPI server for Google Gemini AI food detection and quality assessment
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import re
import uvicorn
import os
import warnings
from dotenv import load_dotenv
from pypdf import PdfReader
from models.gemini_analyzer import GeminiFoodAnalyzer

# Suppress deprecation warning for google.generativeai
warnings.filterwarnings("ignore", category=FutureWarning, message=".*google.generativeai.*")
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Initialize Gemini AI analyzer and chat model (load once on startup)
analyzer = None
chat_model = None

CHAT_SYSTEM_INSTRUCTION = (
    "You are the FoodLoop assistant. Only answer questions about FoodLoop, "
    "food donation, the platform, and how to use it. Be brief and helpful.\n\n"
    "Scope: If the user asks something off-topic (e.g. general knowledge, other products, "
    "unrelated advice), politely say you are here to help with FoodLoop and food donation only, "
    "and offer to answer questions about that.\n\n"
    "Safety: Do not provide information that could be used to hack, exploit, or compromise "
    "the website or any system (e.g. security vulnerabilities, injection techniques, "
    "bypassing authentication, exploiting APIs, or similar). If such a question is asked, "
    "politely refuse and say you cannot assist with that."
)

MAX_KNOWLEDGE_CHARS = 80_000


def load_knowledge_from_pdf(path: str) -> str:
    """
    Load text from a PDF file for use as chatbot knowledge.
    Returns empty string if path is missing, not a file, or on error.
    Truncates to MAX_KNOWLEDGE_CHARS and appends a note if needed.
    """
    if not path or not os.path.isfile(path):
        return ""
    try:
        reader = PdfReader(path)
        parts = []
        total = 0
        for page in reader.pages:
            if total >= MAX_KNOWLEDGE_CHARS:
                break
            text = page.extract_text() or ""
            text = re.sub(r"\s+", " ", text).strip()
            if text:
                remaining = MAX_KNOWLEDGE_CHARS - total
                if len(text) > remaining:
                    text = text[:remaining]
                    total = MAX_KNOWLEDGE_CHARS
                else:
                    total += len(text)
                parts.append(text)
        if not parts:
            return ""
        out = " ".join(parts)
        if total >= MAX_KNOWLEDGE_CHARS:
            out += " [Document truncated for length.]"
        return out
    except Exception as e:
        print(f"⚠️  Failed to load knowledge PDF {path}: {e}")
        return ""


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    global analyzer, chat_model
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️  Warning: GEMINI_API_KEY not found in environment variables")
            print("⚠️  Service will return mock predictions")
            analyzer = None
            chat_model = None
        else:
            genai.configure(api_key=api_key)
            analyzer = GeminiFoodAnalyzer(api_key=api_key)
            print("✅ Gemini AI analyzer initialized successfully")
            # Load optional knowledge PDF (proposal document) for chatbot
            knowledge_path = os.getenv("KNOWLEDGE_PDF_PATH") or os.path.join(
                os.path.dirname(__file__), "knowledge", "proposal.pdf"
            )
            knowledge_text = load_knowledge_from_pdf(knowledge_path)
            if knowledge_text:
                full_system_instruction = (
                    "Use the following knowledge base when answering. "
                    "Base your answers on it when relevant.\n\n"
                    + knowledge_text
                    + "\n\n---\n\n"
                    + CHAT_SYSTEM_INSTRUCTION
                )
                print("✅ Chatbot knowledge base loaded from PDF")
            else:
                full_system_instruction = CHAT_SYSTEM_INSTRUCTION
            # Text chat model: prefer Gemini 3 Flash, then fallbacks
            chat_model = None
            for model_id, label in [
                ("gemini-3-flash-preview", "Gemini 3 Flash"),
                ("gemini-3-flash", "Gemini 3 Flash (alt)"),
                ("gemini-pro", "Gemini Pro"),
            ]:
                try:
                    chat_model = genai.GenerativeModel(
                        model_id,
                        system_instruction=full_system_instruction,
                    )
                    print(f"✅ Gemini chat model initialized: {label}")
                    break
                except Exception as chat_err:
                    print(f"⚠️  {model_id} failed: {chat_err}, trying next fallback")
            if chat_model is None:
                print("⚠️  Chat will be unavailable")
    except Exception as e:
        print(f"⚠️  Warning: Could not initialize Gemini AI: {e}")
        print("⚠️  Service will return mock predictions")
        analyzer = None
        chat_model = None
    
    yield  # App runs here
    
    # Shutdown (cleanup if needed)
    # analyzer cleanup happens automatically

app = FastAPI(
    title="FoodLoop AI Service",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    imageUrl: str

class PredictionResponse(BaseModel):
    foodCategory: str
    itemName: str
    quantity: int
    qualityScore: float
    freshness: str
    storageRecommendation: str
    confidence: float
    detectedItems: List[str]


class ChatHistoryItem(BaseModel):
    role: str  # "user" or "model"
    text: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatHistoryItem]] = None


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "FoodLoop AI Service (Gemini AI)",
        "analyzer_loaded": analyzer is not None
    }

@app.get("/health")
async def health():
    """Health check with analyzer status"""
    return {
        "status": "healthy",
        "analyzer_loaded": analyzer is not None,
        "ai_provider": "Google Gemini"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_food(request: ImageRequest):
    """
    Analyze food image using Gemini AI and return predictions
    
    Args:
        request: ImageRequest with imageUrl
        
    Returns:
        PredictionResponse with food detection results
        
    Raises:
        HTTPException: If non-food items are detected or other validation errors occur
    """
    import time
    start_time = time.time()
    
    try:
        print(f"📥 Received prediction request for image: {request.imageUrl}")
        
        if not analyzer:
            # Return mock predictions if analyzer is not initialized
            print("⚠️  Gemini AI analyzer not initialized, returning mock predictions")
            return get_mock_predictions()
        
        print("🔄 Starting image analysis...")
        # Analyze image using Gemini AI
        predictions = analyzer.analyze_image(request.imageUrl)
        
        elapsed_time = time.time() - start_time
        print(f"✅ Analysis completed in {elapsed_time:.2f} seconds")
        
        return predictions
        
    except ValueError as e:
        # Validation error - non-food items or AI-generated images detected
        error_message = str(e)
        print(f"❌ Validation error: {error_message}")
        
        # Check if it's an AI-generated image error
        if "ai-generated" in error_message.lower() or "synthetic" in error_message.lower() or "fake" in error_message.lower():
            user_message = "AI-generated images are not allowed. Please upload a real photo of food."
            suggestion = "Please upload a real photograph of food. AI-generated, synthetic, or computer-generated images are not accepted."
        # Check if it's a non-food item error
        elif "does not contain food" in error_message.lower() or "non-food" in error_message.lower():
            user_message = "This image does not contain food items. Please upload an image of food only."
            suggestion = "Accepted items: cooked meals, raw ingredients, beverages, snacks, desserts. Not allowed: cleaning products, medicines, electronics, or other non-food items."
        else:
            user_message = error_message
            suggestion = "Please upload an image containing only food items."
        
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid image content",
                "message": user_message,
                "suggestion": suggestion
            }
        )
    except Exception as e:
        error_message = str(e)
        
        # Check if it's a rate limit/quota error
        if "quota" in error_message.lower() or "rate limit" in error_message.lower() or "429" in error_message:
            print(f"❌ Rate limit error: {error_message}")
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "API quota exceeded",
                    "message": "Gemini API rate limit exceeded. You have reached your daily quota. Please try again later or upgrade your API plan.",
                    "suggestion": "Please wait a few hours or upgrade your Gemini API plan. For more information, visit: https://ai.google.dev/gemini-api/docs/rate-limits"
                }
            )
        
        # Other errors - return mock predictions for graceful degradation
        print(f"⚠️  Error in prediction: {e}")
        print("⚠️  Returning mock predictions as fallback")
        import traceback
        traceback.print_exc()
        return get_mock_predictions()

def get_mock_predictions() -> PredictionResponse:
    """Return mock predictions for development/testing"""
    return PredictionResponse(
        foodCategory="Cooked Meals",
        itemName="Vegetable Curry with Rice",
        quantity=15,
        qualityScore=0.90,
        freshness="Fresh",
        storageRecommendation="Hot",
        confidence=0.90,
        detectedItems=["rice", "curry", "vegetables"]
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with FoodLoop assistant using Gemini.
    Request: message (required), history (optional list of {role, text}).
    Response: { reply: "..." }.
    """
    global chat_model
    if not chat_model:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Chat unavailable",
                "message": "AI chat is not configured. Please set GEMINI_API_KEY.",
            },
        )
    message = (request.message or "").strip()
    if not message:
        raise HTTPException(
            status_code=400,
            detail={"error": "message is required", "message": "Message cannot be empty."},
        )
    try:
        history = request.history or []
        # Limit history to last 10 messages to avoid token limits
        history = history[-10:]
        # Convert to Gemini format: list of {role, parts: [text]}
        gemini_history = []
        for item in history:
            role = item.role if item.role in ("user", "model") else "user"
            gemini_history.append({"role": role, "parts": [item.text]})
        if gemini_history:
            chat_session = chat_model.start_chat(history=gemini_history)
            response = chat_session.send_message(message)
        else:
            response = chat_model.generate_content(message)
        reply = response.text if response and response.text else "I couldn't generate a response. Please try again."
        return ChatResponse(reply=reply)
    except Exception as e:
        err_msg = str(e)
        if "quota" in err_msg.lower() or "rate limit" in err_msg.lower() or "429" in err_msg:
            raise HTTPException(
                status_code=503,
                detail={
                    "error": "API quota exceeded",
                    "message": "Gemini API rate limit exceeded. Please try again later.",
                },
            )
        raise HTTPException(
            status_code=500,
            detail={"error": "Chat failed", "message": err_msg or "An error occurred while generating a response."},
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
