"""
Google Gemini Vision API Food Analyzer
Replaces YOLOv11 with Gemini AI for superior food recognition
"""
import os
import json
import time
import requests
from PIL import Image
from io import BytesIO
from typing import Dict, Optional
import warnings

# Suppress deprecation warning for google.generativeai
warnings.filterwarnings("ignore", category=FutureWarning, message=".*google.generativeai.*")

import google.generativeai as genai


class GeminiFoodAnalyzer:
    """Food analyzer using Google Gemini Vision API"""
    
    # Storage recommendations based on food type
    STORAGE_MAP = {
        'cooked_meals': 'Hot',
        'raw_food': 'Cold',
        'beverages': 'Cold',
        'snacks': 'Dry',
        'desserts': 'Cold',
    }
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini client
        
        Args:
            api_key: Google Gemini API key (or from GEMINI_API_KEY env var)
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Initialize Gemini client with API key
        try:
            # Use google.generativeai (old package, still works)
            genai.configure(api_key=self.api_key)
            
            # List available models to find the correct one
            print("🔍 Listing available Gemini models...")
            try:
                available_models = genai.list_models()
                model_names = [model.name for model in available_models if 'generateContent' in model.supported_generation_methods]
                print(f"📋 Available models with generateContent: {model_names}")
                
                # Filter for vision-capable models (usually contain 'vision' or are gemini models)
                vision_models = [name for name in model_names if 'gemini' in name.lower() or 'vision' in name.lower()]
                
                if vision_models:
                    # Prioritize Gemini 2.5 models (better rate limits)
                    # Order: Flash-Lite (15 RPM, 1000 RPD) > Flash (10 RPM, 250 RPD) > Pro (5 RPM, 100 RPD)
                    preferred_order = ['2.5-flash-lite', '2.5-flash', '2.5-pro', '1.5-flash', '1.5-pro', 'pro']
                    
                    selected_model = None
                    for preferred in preferred_order:
                        for model in vision_models:
                            if preferred in model.lower():
                                selected_model = model
                                break
                        if selected_model:
                            break
                    
                    # If no preferred model found, use first available
                    if not selected_model:
                        selected_model = vision_models[0]
                    
                    # Extract model name (remove 'models/' prefix if present)
                    model_name = selected_model.split('/')[-1] if '/' in selected_model else selected_model
                    print(f"✅ Using model: {model_name}")
                    self.model = genai.GenerativeModel(model_name)
                    print(f"✅ Gemini AI model initialized successfully: {model_name}")
                else:
                    # Fallback: try common model names (Gemini 2.5 models)
                    print("⚠️  No vision models found in list, trying Gemini 2.5 model names...")
                    model_names_to_try = [
                        'models/gemini-2.5-flash',      # Fastest, 10 RPM, 250 RPD
                        'models/gemini-2.5-flash-lite', # 15 RPM, 1000 RPD
                        'models/gemini-2.5-pro',        # Most capable, 5 RPM, 100 RPD
                        'gemini-2.5-flash',
                        'gemini-2.5-flash-lite',
                        'gemini-2.5-pro',
                        # Legacy fallbacks
                        'models/gemini-1.5-pro',
                        'models/gemini-1.5-flash',
                        'gemini-pro',
                    ]
                    
                    model_initialized = False
                    for model_name in model_names_to_try:
                        try:
                            print(f"🔄 Trying: {model_name}")
                            self.model = genai.GenerativeModel(model_name)
                            print(f"✅ Gemini AI model initialized: {model_name}")
                            model_initialized = True
                            break
                        except Exception as e:
                            print(f"⚠️  {model_name} failed: {str(e)[:80]}")
                            continue
                    
                    if not model_initialized:
                        raise Exception("Could not initialize any Gemini model. Available models: " + str(model_names))
                        
            except Exception as list_error:
                print(f"⚠️  Could not list models: {list_error}")
                print("🔄 Trying direct model initialization with common names...")
                
                # Fallback: try Gemini 2.5 model names directly
                model_names_to_try = [
                    'models/gemini-2.5-flash',      # Fastest, 10 RPM, 250 RPD
                    'models/gemini-2.5-flash-lite', # 15 RPM, 1000 RPD
                    'models/gemini-2.5-pro',        # Most capable, 5 RPM, 100 RPD
                    'gemini-2.5-flash',
                    'gemini-2.5-flash-lite',
                    'gemini-2.5-pro',
                    # Legacy fallbacks
                    'models/gemini-1.5-pro',
                    'models/gemini-1.5-flash',
                    'gemini-pro',
                ]
                
                model_initialized = False
                for model_name in model_names_to_try:
                    try:
                        print(f"🔄 Trying: {model_name}")
                        self.model = genai.GenerativeModel(model_name)
                        print(f"✅ Gemini AI model initialized: {model_name}")
                        model_initialized = True
                        break
                    except Exception as e:
                        print(f"⚠️  {model_name} failed: {str(e)[:80]}")
                        continue
                
                if not model_initialized:
                    raise Exception(f"Could not initialize any Gemini model. Last error: {list_error}")
                
        except Exception as e:
            print(f"❌ Error initializing Gemini model: {e}")
            raise
    
    def download_image(self, image_url: str) -> Image.Image:
        """
        Download image from URL
        
        Args:
            image_url: URL of the image
            
        Returns:
            PIL Image object
        """
        try:
            print(f"⬇️  Downloading image (timeout: 15s)...")
            download_start = time.time()
            response = requests.get(image_url, timeout=15)
            response.raise_for_status()
            download_elapsed = time.time() - download_start
            print(f"✅ Image download completed in {download_elapsed:.2f} seconds")
            
            # Convert to PIL Image
            image = Image.open(BytesIO(response.content))
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            return image
        except Exception as e:
            raise Exception(f"Failed to download image: {str(e)}")
    
    def create_analysis_prompt(self) -> str:
        """
        Create structured prompt for Gemini to analyze food images
        
        Returns:
            Prompt string
        """
        return """Analyze this food image and provide a detailed analysis in JSON format.

IMPORTANT RULES:
1. STRICT VALIDATION: If the image contains ANY NON-FOOD items, you MUST respond with: {"error": "This image does not contain food items. Please upload an image of food only."}
   - Non-food items include: cleaning products (detergents, soaps, disinfectants), medicines, electronics, clothing, furniture, tools, toys, books, plants (non-edible), animals (pets), vehicles, etc.
   - If the image shows ONLY non-food items, or if food items are mixed with non-food items, return the error.
   - ONLY proceed with analysis if the image contains FOOD items (cooked meals, raw ingredients, beverages, snacks, desserts, etc.)

2. Only analyze if the image contains FOOD items
3. Be SPECIFIC with food names (e.g., "Chappati", "Rice and Curry", "Biryani" - NOT "Food Item" or generic names)
4. Use common Indian food names when applicable (Chappati, Roti, Naan, Dosa, Idli, Sambar, Dal, Biryani, Pulao, etc.)

Return a JSON object with the following structure:
{
    "foodCategory": "Cooked Meals" | "Raw Food" | "Beverages" | "Snacks" | "Desserts",
    "itemName": "Specific food name (e.g., 'Chappati', 'Rice and Curry', 'Vegetable Biryani')",
    "quantity": <number of servings/plates>,
    "qualityScore": <0.0 to 1.0>,
    "freshness": "Fresh" | "Good" | "Fair",
    "storageRecommendation": "Hot" | "Cold" | "Dry",
    "confidence": <0.0 to 1.0>,
    "detectedItems": ["list", "of", "specific", "food", "items"]
}

Guidelines:
- itemName: Be very specific. If you see chappati/roti, say "Chappati" or "Roti", not "Food Item"
- quantity: Estimate number of servings (e.g., if 5 chappatis, quantity is 5)
- qualityScore: Assess based on appearance (0.9+ for fresh, 0.7-0.9 for good, <0.7 for fair)
- freshness: "Fresh" if looks newly prepared, "Good" if acceptable, "Fair" if older
- storageRecommendation: "Hot" for cooked meals, "Cold" for raw/perishable, "Dry" for snacks
- detectedItems: List all specific food items you can identify (e.g., ["chappati", "curry", "rice"])

Respond ONLY with valid JSON, no additional text."""
    
    def parse_gemini_response(self, response_text: str) -> Dict:
        """
        Parse Gemini's response and extract food analysis
        
        Args:
            response_text: Raw response from Gemini
            
        Returns:
            Dictionary with food analysis
        """
        try:
            # Clean the response - remove markdown code blocks if present
            text = response_text.strip()
            
            # Remove ```json and ``` if present
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            
            if text.endswith("```"):
                text = text[:-3]
            
            text = text.strip()
            
            # Parse JSON
            data = json.loads(text)
            
            # Check for error (non-food items detected)
            if "error" in data:
                error_msg = data["error"]
                # Make error message more user-friendly
                if "non-food" in error_msg.lower() or "does not contain food" in error_msg.lower():
                    raise ValueError("This image does not contain food items. Please upload an image of food only (cooked meals, ingredients, beverages, snacks, etc.). Non-food items like cleaning products, medicines, or electronics are not allowed.")
                else:
                    raise ValueError(error_msg)
            
            # Validate required fields
            required_fields = ["foodCategory", "itemName", "quantity", "qualityScore", 
                            "freshness", "storageRecommendation", "confidence", "detectedItems"]
            
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")
            
            return data
            
        except json.JSONDecodeError as e:
            print(f"⚠️  Error parsing Gemini response as JSON: {e}")
            print(f"Response text: {response_text[:500]}")
            raise ValueError("Invalid JSON response from Gemini AI")
        except Exception as e:
            print(f"⚠️  Error processing Gemini response: {e}")
            raise
    
    def analyze_image(self, image_url: str) -> Dict:
        """
        Analyze food image using Gemini Vision API
        
        Args:
            image_url: URL of the image to analyze
            
        Returns:
            Dictionary with food analysis results
        """
        try:
            print(f"🔍 Downloading image from: {image_url}")
            
            # Download image
            image = self.download_image(image_url)
            print("✅ Image downloaded successfully")
            
            # Create prompt
            prompt = self.create_analysis_prompt()
            
            print("🤖 Sending image to Gemini AI for analysis...")
            
            # Call Gemini Vision API with retry logic
            max_retries = 2
            retry_delay = 1
            response_text = None
            
            for attempt in range(max_retries + 1):
                try:
                    print(f"🔄 Attempt {attempt + 1}/{max_retries + 1}: Calling Gemini API...")
                    api_start_time = time.time()
                    
                    # Use google.generativeai API (old package, still works)
                    # Set generation config for faster response
                    generation_config = {
                        "temperature": 0.4,
                        "max_output_tokens": 2048,
                    }
                    response = self.model.generate_content(
                        [prompt, image],
                        generation_config=generation_config
                    )
                    
                    api_elapsed = time.time() - api_start_time
                    print(f"⏱️  Gemini API call took {api_elapsed:.2f} seconds")
                    
                    # Get response text
                    if not response.text:
                        raise Exception("Empty response from Gemini AI")
                    
                    response_text = response.text
                    print(f"📝 Gemini response received: {response_text[:200]}...")
                    break  # Success, exit retry loop
                    
                except Exception as e:
                    error_msg = str(e)
                    
                    # Handle specific Gemini API errors
                    if "API_KEY" in error_msg or "api key" in error_msg.lower():
                        raise Exception("Invalid or missing Gemini API key. Please check your GEMINI_API_KEY environment variable.")
                    elif "safety" in error_msg.lower() or "blocked" in error_msg.lower():
                        raise ValueError("Image was blocked by safety filters. Please ensure the image contains appropriate content.")
                    elif ("quota" in error_msg.lower() or "rate limit" in error_msg.lower()) and attempt < max_retries:
                        # Retry on rate limit
                        print(f"⚠️  Rate limit hit, retrying in {retry_delay} seconds... (attempt {attempt + 1}/{max_retries + 1})")
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                        continue
                    elif attempt == max_retries:
                        # Final attempt failed
                        raise Exception(f"Gemini API error after {max_retries + 1} attempts: {error_msg}")
                    else:
                        # Other errors, retry
                        print(f"⚠️  Error occurred, retrying... (attempt {attempt + 1}/{max_retries + 1})")
                        time.sleep(retry_delay)
                        retry_delay *= 2
                        continue
            
            if not response_text:
                raise Exception("Failed to get response from Gemini AI after retries")
            
            # Parse response
            analysis = self.parse_gemini_response(response_text)
            
            print(f"✅ Analysis complete:")
            print(f"   - Item: {analysis['itemName']}")
            print(f"   - Category: {analysis['foodCategory']}")
            print(f"   - Quantity: {analysis['quantity']}")
            print(f"   - Freshness: {analysis['freshness']}")
            print(f"   - Confidence: {analysis['confidence']}")
            
            return analysis
            
        except ValueError as e:
            # Re-raise validation errors (non-food items, etc.)
            error_msg = str(e)
            print(f"❌ Validation error: {error_msg}")
            raise ValueError(error_msg)
        except Exception as e:
            print(f"❌ Error analyzing image with Gemini: {e}")
            import traceback
            traceback.print_exc()
            raise Exception(f"Failed to analyze image: {str(e)}")
