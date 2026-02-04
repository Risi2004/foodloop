"""
FastAPI server for Google Gemini AI food detection and quality assessment
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
from dotenv import load_dotenv
from models.gemini_analyzer import GeminiFoodAnalyzer

# Load environment variables from .env file
load_dotenv()

# Initialize Gemini AI analyzer (load once on startup)
analyzer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    global analyzer
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️  Warning: GEMINI_API_KEY not found in environment variables")
            print("⚠️  Service will return mock predictions")
            analyzer = None
        else:
            analyzer = GeminiFoodAnalyzer(api_key=api_key)
            print("✅ Gemini AI analyzer initialized successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not initialize Gemini AI: {e}")
        print("⚠️  Service will return mock predictions")
        analyzer = None
    
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

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
