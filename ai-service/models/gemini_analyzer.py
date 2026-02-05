"""
Google Gemini Vision API Food Analyzer
Food detection and quality assessment using Gemini AI.
"""
import os
import json
import time
import requests
import re
from PIL import Image
from io import BytesIO
from typing import Dict, Optional
import warnings

# Suppress deprecation warning for google.generativeai BEFORE importing
# Note: google.genai has a different API structure, so we continue using google.generativeai
# The package still works, just shows a deprecation warning
warnings.filterwarnings("ignore", category=FutureWarning, message=".*google.generativeai.*")
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")

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
            # Use google.generativeai (deprecated but still functional)
            # Note: google.genai has different API, migration would require code rewrite
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
                    # Prioritize Gemini 2.5 Flash-Lite (best free tier limits: 15 RPM, 1000 RPD)
                    # Order: 2.5-flash-lite > 2.5-flash > 2.5-pro > 1.5 models (fallback)
                    preferred_order = ['2.5-flash-lite', '2.5-flash', '2.5-pro', '1.5-flash-lite', '1.5-flash', '1.5-pro', 'pro']
                    
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
                    # Fallback: try common model names (Gemini 2.5 Flash-Lite first - best free tier limits)
                    print("⚠️  No vision models found in list, trying Gemini 2.5 Flash-Lite model names...")
                    model_names_to_try = [
                        'models/gemini-2.5-flash-lite', # Primary: Gemini 2.5 Flash-Lite (15 RPM, 1000 RPD)
                        'gemini-2.5-flash-lite',
                        'models/gemini-2.5-flash',      # Fallback: Gemini 2.5 Flash (10 RPM, 250 RPD)
                        'gemini-2.5-flash',
                        'models/gemini-2.5-pro',        # Fallback: Gemini 2.5 Pro (5 RPM, 100 RPD)
                        'gemini-2.5-pro',
                        # Legacy fallbacks (Gemini 1.5 models)
                        'models/gemini-1.5-flash-lite',
                        'models/gemini-1.5-flash',
                        'models/gemini-1.5-pro',
                        'gemini-1.5-flash-lite',
                        'gemini-1.5-flash',
                        'gemini-1.5-pro',
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
                print("🔄 Trying direct model initialization with Gemini 2.5 Flash-Lite...")
                
                # Fallback: try Gemini 2.5 Flash-Lite model names directly (best free tier limits)
                model_names_to_try = [
                    'models/gemini-2.5-flash-lite', # Primary: Gemini 2.5 Flash-Lite (15 RPM, 1000 RPD)
                    'gemini-2.5-flash-lite',
                    'models/gemini-2.5-flash',      # Fallback: Gemini 2.5 Flash (10 RPM, 250 RPD)
                    'gemini-2.5-flash',
                    'models/gemini-2.5-pro',        # Fallback: Gemini 2.5 Pro (5 RPM, 100 RPD)
                    'gemini-2.5-pro',
                    # Legacy fallbacks (Gemini 1.5 models)
                    'models/gemini-1.5-flash-lite',
                    'models/gemini-1.5-flash',
                    'models/gemini-1.5-pro',
                    'gemini-1.5-flash-lite',
                    'gemini-1.5-flash',
                    'gemini-1.5-pro',
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
    
    def create_ai_detection_prompt(self) -> str:
        """
        Create prompt for Gemini to detect AI-generated images
        
        Returns:
            Prompt string for AI detection
        """
        return """Analyze this image and determine if it is AI-generated, synthetic, or computer-generated.

Look for signs of:
- Unrealistic textures, patterns, or artifacts typical of AI image generation
- Characteristics of AI art generators (DALL-E, Midjourney, Stable Diffusion, etc.)
- Synthetic or computer-generated food appearance
- Unnatural lighting, shadows, or reflections
- Repetitive patterns or inconsistencies typical of AI generation
- Overly perfect or unrealistic food presentation

Respond with ONLY a JSON object:
{
    "isAiGenerated": true or false,
    "confidence": <0.0 to 1.0>,
    "reason": "brief explanation if AI-generated"
}

If the image appears to be a real photograph of food, set isAiGenerated to false.
If the image appears to be AI-generated, synthetic, or fake, set isAiGenerated to true.

Respond ONLY with valid JSON, no additional text."""
    
    def detect_ai_generated_image(self, image: Image.Image) -> Dict:
        """
        Detect if an image is AI-generated or synthetic
        
        Args:
            image: PIL Image object to analyze
            
        Returns:
            Dictionary with isAiGenerated (bool) and confidence (float)
            
        Raises:
            ValueError: If image is detected as AI-generated
        """
        try:
            print("🔍 Checking if image is AI-generated...")
            
            # Create detection prompt
            prompt = self.create_ai_detection_prompt()
            
            # Call Gemini API for detection
            max_retries = 2
            retry_delay = 1
            response_text = None
            
            for attempt in range(max_retries + 1):
                try:
                    print(f"🔄 AI detection attempt {attempt + 1}/{max_retries + 1}...")
                    api_start_time = time.time()
                    
                    # Use google.generativeai API
                    generation_config = {
                        "temperature": 0.3,  # Lower temperature for more consistent detection
                        "max_output_tokens": 512,
                    }
                    response = self.model.generate_content(
                        [prompt, image],
                        generation_config=generation_config
                    )
                    
                    api_elapsed = time.time() - api_start_time
                    print(f"⏱️  AI detection API call took {api_elapsed:.2f} seconds")
                    
                    if not response.text:
                        raise Exception("Empty response from Gemini AI")
                    
                    response_text = response.text
                    print(f"📝 AI detection response: {response_text[:200]}...")
                    break  # Success, exit retry loop
                    
                except Exception as e:
                    error_msg = str(e)
                    
                    if "API_KEY" in error_msg or "api key" in error_msg.lower():
                        raise Exception("Invalid or missing Gemini API key")
                    elif ("quota" in error_msg.lower() or "rate limit" in error_msg.lower() or "429" in error_msg):
                        # Rate limit hit - don't retry AI detection, just skip it
                        raise Exception(f"Rate limit exceeded during AI detection: {error_msg}")
                    elif attempt == max_retries:
                        raise Exception(f"AI detection failed after {max_retries + 1} attempts: {error_msg}")
                    else:
                        print(f"⚠️  Error occurred, retrying... (attempt {attempt + 1}/{max_retries + 1})")
                        time.sleep(retry_delay)
                        retry_delay *= 2
                        continue
            
            if not response_text:
                raise Exception("Failed to get AI detection response from Gemini AI")
            
            # Parse response
            text = response_text.strip()
            
            # Remove markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            
            if text.endswith("```"):
                text = text[:-3]
            
            text = text.strip()
            
            # Parse JSON
            data = json.loads(text)
            
            # Validate response
            if "isAiGenerated" not in data:
                raise ValueError("Invalid AI detection response: missing isAiGenerated field")
            
            is_ai_generated = bool(data["isAiGenerated"])
            confidence = float(data.get("confidence", 0.5))
            reason = data.get("reason", "")
            
            print(f"🔍 AI Detection Result: isAiGenerated={is_ai_generated}, confidence={confidence:.2f}")
            if reason:
                print(f"   Reason: {reason}")
            
            # If AI-generated with high confidence, raise error
            if is_ai_generated and confidence >= 0.7:
                error_msg = "This image appears to be AI-generated or synthetic. Please upload a real photograph of food."
                if reason:
                    error_msg += f" ({reason})"
                raise ValueError(error_msg)
            
            return {
                "isAiGenerated": is_ai_generated,
                "confidence": confidence,
                "reason": reason
            }
            
        except ValueError:
            # Re-raise validation errors (AI-generated detected)
            raise
        except Exception as e:
            print(f"⚠️  Error in AI detection: {e}")
            # If detection fails, log but don't block (fail open for now)
            # In production, you might want to fail closed
            print("⚠️  AI detection failed, proceeding with food analysis...")
            return {
                "isAiGenerated": False,
                "confidence": 0.0,
                "reason": "Detection failed"
            }
    
    def create_analysis_prompt(self) -> str:
        """
        Create structured prompt for Gemini to analyze food images
        
        Returns:
            Prompt string
        """
        return """You are an expert food recognition system. Analyze this food image carefully and provide accurate, specific food identification.

CRITICAL INSTRUCTIONS FOR FOOD NAME IDENTIFICATION:
1. Look at the image VERY CAREFULLY and identify EXACTLY what food items are visible
2. Use the ACTUAL, SPECIFIC name of the food item(s) you see - NEVER use generic terms like "Food Item", "Cooked Meal", "Dish", "Meal", etc.
3. If you see multiple items, combine them descriptively (e.g., "Rice and Dal Curry", "Chappati with Vegetable Curry", "Biryani with Raita")
4. For Indian foods, use the correct regional names:
   - Flatbreads: "Chappati", "Roti", "Naan", "Paratha", "Poori" (identify which one you see)
   - Rice dishes: "Biryani", "Pulao", "Fried Rice", "Plain Rice" (be specific)
   - Curries: "Dal Curry", "Vegetable Curry", "Chicken Curry", "Fish Curry" (specify the type)
   - Snacks: "Samosa", "Pakora", "Dosa", "Idli", "Vada" (use exact names)
   - Others: "Sambar", "Rasam", "Chutney", "Pickle", etc.
5. For international foods, use standard names: "Pizza", "Burger", "Pasta", "Salad", "Soup", etc.
6. If you cannot identify the specific food, describe what you see: "Yellow Curry with Rice", "Fried Flatbread", "Steamed Rice Cakes"
7. NEVER use placeholder names - always use what you actually observe in the image

PRODUCT TYPE DETECTION:
- "cooked": Freshly prepared food, not commercially packaged (e.g., home-cooked meals, restaurant food in containers, freshly made items)
- "packed": Commercially packaged products with labels, barcodes, or sealed packaging (e.g., packaged snacks, bottled beverages, canned goods, sealed food packages)

EXPIRY DATE DETECTION (for packed products only):
- If productType is "packed", carefully examine the package for expiry date, best before date, or use by date
- Look for dates in formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, or text like "Best Before", "Expires", "Use By"
- If you can clearly read the expiry date, return it as ISO date string (YYYY-MM-DD format)
- If expiry date is not visible or unclear, set expiryDateFromPackage to null

VALIDATION RULES:
- If the image contains ANY NON-FOOD items (cleaning products, medicines, electronics, etc.), respond with: {"error": "This image does not contain food items. Please upload an image of food only."}
- ONLY proceed with analysis if the image contains FOOD items

Return a JSON object with this EXACT structure:
{
    "foodCategory": "Cooked Meals" | "Raw Food" | "Beverages" | "Snacks" | "Desserts",
    "itemName": "EXACT SPECIFIC FOOD NAME - Use the real name of what you see, e.g., 'Chappati', 'Rice and Dal Curry', 'Vegetable Biryani', 'Dosa with Sambar'",
    "quantity": <number of servings/plates/items you can count>,
    "qualityScore": <0.0 to 1.0 - assess visual quality>,
    "freshness": "Fresh" | "Good" | "Fair",
    "storageRecommendation": "Hot" | "Cold" | "Dry",
    "confidence": <0.0 to 1.0 - your confidence in the identification>,
    "detectedItems": ["specific", "food", "items", "you", "can", "see", "e.g.", "chappati", "dal", "rice"],
    "productType": "cooked" | "packed",
    "expiryDateFromPackage": <ISO date string or null - only if productType is "packed" and you can clearly read expiry date from package label>
}

EXAMPLES OF CORRECT itemName:
- ✅ "Chappati" (if you see round flatbread)
- ✅ "Rice and Dal Curry" (if you see rice with dal)
- ✅ "Vegetable Biryani" (if you see biryani with vegetables)
- ✅ "Dosa with Sambar" (if you see dosa and sambar)
- ✅ "Samosa" (if you see samosa)
- ❌ "Food Item" (WRONG - too generic)
- ❌ "Cooked Meal" (WRONG - too generic)
- ❌ "Indian Food" (WRONG - too generic)

Remember: itemName MUST be the specific, actual name of the food you see. Look carefully at the image and identify the exact food item(s).

Respond ONLY with valid JSON, no additional text or explanations."""
    
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
                            "freshness", "storageRecommendation", "confidence", "detectedItems", "productType"]
            
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Validate productType
            if data.get("productType") not in ["cooked", "packed"]:
                # Default to "cooked" if invalid
                data["productType"] = "cooked"
            
            # Validate expiryDateFromPackage if present (for packed products)
            # Keep it as ISO string - don't convert to datetime (needs to be JSON-serializable)
            if data.get("expiryDateFromPackage"):
                try:
                    # Validate it's a valid date string format
                    if isinstance(data["expiryDateFromPackage"], str):
                        from datetime import datetime
                        # Try to parse to validate, but keep as string
                        datetime.fromisoformat(data["expiryDateFromPackage"].replace('Z', '+00:00'))
                        # If parsing succeeds, keep the string as-is
                    elif data["expiryDateFromPackage"] is None:
                        pass  # None is valid
                    else:
                        # Invalid type, set to None
                        print(f"⚠️  expiryDateFromPackage has invalid type: {type(data['expiryDateFromPackage'])}")
                        data["expiryDateFromPackage"] = None
                except Exception as e:
                    print(f"⚠️  Could not validate expiryDateFromPackage: {e}")
                    data["expiryDateFromPackage"] = None
            
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
            
            # First, check if image is AI-generated (before food analysis)
            # Skip if rate limited to save API quota for food analysis
            try:
                ai_detection_result = self.detect_ai_generated_image(image)
                if ai_detection_result.get("isAiGenerated", False) and ai_detection_result.get("confidence", 0) >= 0.7:
                    # This should have raised ValueError, but handle it just in case
                    raise ValueError("This image appears to be AI-generated or synthetic. Please upload a real photograph of food.")
            except ValueError as ve:
                # Re-raise AI-generated image errors
                raise ve
            except Exception as e:
                error_msg = str(e)
                # If it's a rate limit/quota error, skip AI detection to save API calls
                if "quota" in error_msg.lower() or "rate limit" in error_msg.lower() or "429" in error_msg:
                    print("⚠️  Rate limit detected during AI detection, skipping to save API quota for food analysis...")
                else:
                    # If detection fails for other reasons, log but continue (fail open)
                    print(f"⚠️  AI detection encountered an error, proceeding with food analysis: {e}")
            
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
                    
                    # Use google.generativeai API (deprecated but still functional)
                    # Set generation config for more accurate food identification
                    # Lower temperature for more consistent and accurate results
                    generation_config = {
                        "temperature": 0.2,  # Lower temperature for more accurate food name identification
                        "max_output_tokens": 2048,
                        "top_p": 0.8,  # Focus on most likely food names
                        "top_k": 40,  # Limit to top 40 most relevant tokens
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
                    elif ("quota" in error_msg.lower() or "rate limit" in error_msg.lower() or "429" in error_msg) and attempt < max_retries:
                        # Parse retry delay from error message if available
                        retry_delay_seconds = retry_delay
                        retry_delay_match = re.search(r'retry in ([\d.]+)s', error_msg, re.IGNORECASE)
                        if retry_delay_match:
                            try:
                                retry_delay_seconds = float(retry_delay_match.group(1))
                                # Add a small buffer (10% extra)
                                retry_delay_seconds = retry_delay_seconds * 1.1
                                print(f"⚠️  Rate limit hit. API suggests retry in {retry_delay_seconds:.1f} seconds...")
                            except ValueError:
                                pass
                        
                        # Use exponential backoff with minimum delay
                        actual_delay = max(retry_delay_seconds, retry_delay)
                        print(f"⚠️  Waiting {actual_delay:.1f} seconds before retry (attempt {attempt + 1}/{max_retries + 1})...")
                        time.sleep(actual_delay)
                        retry_delay *= 2  # Exponential backoff for next attempt
                        continue
                    elif attempt == max_retries:
                        # Final attempt failed - provide user-friendly error message
                        if "quota" in error_msg.lower() or "rate limit" in error_msg.lower() or "429" in error_msg:
                            raise Exception("Gemini API rate limit exceeded. You have reached your daily quota. Please try again later or upgrade your API plan. For more information, visit: https://ai.google.dev/gemini-api/docs/rate-limits")
                        else:
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
