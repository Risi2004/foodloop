"""
YOLOv11 Food Detection Model Wrapper
"""
from ultralytics import YOLO
import cv2
import numpy as np
import requests
from PIL import Image
from io import BytesIO
from typing import Dict, List, Tuple
import os

class YOLOFoodDetector:
    """Wrapper class for YOLOv11 food detection"""
    
    # Food category mapping (customize based on your model classes)
    FOOD_CATEGORIES = {
        'cooked_meals': 'Cooked Meals',
        'raw_food': 'Raw Food',
        'beverages': 'Beverages',
        'snacks': 'Snacks',
        'desserts': 'Desserts',
    }
    
    # Storage recommendations based on food type
    STORAGE_MAP = {
        'cooked_meals': 'Hot',
        'raw_food': 'Cold',
        'beverages': 'Cold',
        'snacks': 'Dry',
        'desserts': 'Cold',
    }
    
    # Known food-related keywords (for validation)
    FOOD_KEYWORDS = {
        # Common food items
        'apple', 'banana', 'orange', 'bread', 'rice', 'pasta', 'noodle', 'pizza', 'burger',
        'sandwich', 'salad', 'soup', 'curry', 'chicken', 'beef', 'fish', 'egg', 'milk',
        'cheese', 'yogurt', 'butter', 'cake', 'cookie', 'chocolate', 'ice cream', 'dessert',
        'vegetable', 'fruit', 'meat', 'seafood', 'grains', 'cereal', 'snack', 'beverage',
        'drink', 'juice', 'coffee', 'tea', 'water', 'soda', 'chappati', 'roti', 'naan',
        'dosa', 'idli', 'sambar', 'dal', 'biryani', 'pulao', 'fried', 'grilled', 'baked',
        # Food containers (acceptable if food is inside)
        'bowl', 'plate', 'dish', 'container', 'packet', 'box', 'bag', 'bottle', 'can',
        # Food categories
        'cooked', 'raw', 'fresh', 'prepared', 'meal', 'food', 'cuisine', 'dish'
    }
    
    # Non-food items that should be rejected
    NON_FOOD_KEYWORDS = {
        'person', 'people', 'human', 'man', 'woman', 'child', 'baby',
        'dog', 'cat', 'animal', 'pet', 'bird', 'horse', 'cow',
        'car', 'truck', 'bus', 'vehicle', 'motorcycle', 'bicycle',
        'phone', 'laptop', 'computer', 'keyboard', 'mouse', 'screen',
        'book', 'newspaper', 'magazine', 'paper',
        'bottle', 'container', 'package', 'box', 'bag',  # Only if no food context
        'cleaning', 'detergent', 'soap', 'shampoo', 'toothpaste', 'medicine', 'pill',
        'harpic', 'bleach', 'chemical', 'toxic', 'poison'
    }
    
    def __init__(self, model_path: str = None):
        """
        Initialize YOLOv11 model
        
        Args:
            model_path: Path to YOLOv11 model weights (.pt file)
        """
        self.model_path = model_path or "./models/yolov11n.pt"
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load YOLOv11 model"""
        try:
            if os.path.exists(self.model_path):
                self.model = YOLO(self.model_path)
                print(f"✅ Loaded YOLOv11 model from {self.model_path}")
            else:
                # Try loading pre-trained model if custom model not found
                print(f"⚠️  Model file not found at {self.model_path}")
                print("⚠️  Attempting to load pre-trained YOLOv11 model...")
                self.model = YOLO('yolov11n.pt')  # Nano model for faster inference
                print("✅ Loaded pre-trained YOLOv11 model")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("⚠️  Model will not be available. Using mock predictions.")
            self.model = None
    
    def download_image(self, image_url: str) -> np.ndarray:
        """
        Download image from URL and convert to numpy array
        
        Args:
            image_url: URL of the image
            
        Returns:
            numpy array of the image
        """
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            
            # Convert to PIL Image
            image = Image.open(BytesIO(response.content))
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            img_array = np.array(image)
            
            return img_array
        except Exception as e:
            raise Exception(f"Failed to download image: {str(e)}")
    
    def detect_food(self, image: np.ndarray) -> Dict:
        """
        Run YOLOv11 inference on image
        
        Args:
            image: numpy array of the image
            
        Returns:
            Dictionary with detection results
        """
        if not self.model:
            raise Exception("Model not loaded")
        
        # Run inference
        results = self.model(image)
        
        # Get class names from model (if available)
        class_names = getattr(self.model, 'names', {})
        
        # Extract detections
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                class_name = class_names.get(cls, f"class_{cls}") if class_names else f"class_{cls}"
                detections.append({
                    'class': cls,
                    'class_name': class_name,
                    'confidence': conf,
                    'bbox': box.xyxy[0].tolist()
                })
        
        return {
            'detections': detections,
            'num_detections': len(detections)
        }
    
    def estimate_quantity(self, detections: List[Dict]) -> int:
        """
        Estimate quantity based on number of detections
        
        Args:
            detections: List of detection dictionaries
            
        Returns:
            Estimated quantity (number of servings/plates)
        """
        num_detections = len(detections)
        
        # Simple heuristic: each detection might represent a serving
        # Adjust based on your model's behavior
        if num_detections == 0:
            return 1  # Default to 1 if nothing detected
        elif num_detections <= 5:
            return num_detections
        else:
            # For many detections, estimate based on bounding box sizes
            return min(num_detections, 20)  # Cap at 20
    
    def assess_quality(self, image: np.ndarray, detections: List[Dict]) -> Dict:
        """
        Assess food quality and freshness
        
        Args:
            image: numpy array of the image
            detections: List of detection results
            
        Returns:
            Dictionary with quality metrics
        """
        # Simple quality assessment based on image brightness and contrast
        # In production, you might use more sophisticated methods
        
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Calculate image statistics
        brightness = np.mean(gray)
        contrast = np.std(gray)
        
        # Normalize to 0-1 range
        brightness_score = min(brightness / 255.0, 1.0)
        contrast_score = min(contrast / 128.0, 1.0)
        
        # Combined quality score
        quality_score = (brightness_score * 0.5 + contrast_score * 0.5)
        
        # Determine freshness
        if quality_score >= 0.7:
            freshness = "Fresh"
        elif quality_score >= 0.5:
            freshness = "Good"
        else:
            freshness = "Fair"
        
        return {
            'qualityScore': float(quality_score),
            'freshness': freshness
        }
    
    def get_food_category(self, detections: List[Dict]) -> str:
        """
        Map detected classes to food category
        
        Args:
            detections: List of detection results
            
        Returns:
            Food category string
        """
        if not detections:
            return "Cooked Meals"  # Default
        
        # Get most confident detection
        best_detection = max(detections, key=lambda x: x['confidence'])
        class_id = best_detection['class']
        
        # Map class ID to category (customize based on your model)
        # This is a placeholder - adjust based on your trained model's classes
        category_map = {
            0: 'Cooked Meals',
            1: 'Raw Food',
            2: 'Beverages',
            3: 'Snacks',
            4: 'Desserts',
        }
        
        return category_map.get(class_id, 'Cooked Meals')
    
    def is_food_item(self, class_name: str) -> bool:
        """
        Check if a detected class name is food-related
        
        Args:
            class_name: Name of the detected class
            
        Returns:
            True if the item is food-related, False otherwise
        """
        if not class_name:
            return False
        
        class_name_lower = class_name.lower()
        
        # Check if it's explicitly a non-food item
        for non_food in self.NON_FOOD_KEYWORDS:
            if non_food in class_name_lower:
                return False
        
        # Check if it's a food-related keyword
        for food_keyword in self.FOOD_KEYWORDS:
            if food_keyword in class_name_lower:
                return True
        
        # If using default YOLO model (COCO classes), check common food classes
        # COCO dataset has limited food classes, so we need to be more lenient
        # but still reject obvious non-food items
        
        # Accept if it's a container that might hold food (bowl, plate, etc.)
        container_keywords = ['bowl', 'plate', 'dish', 'cup', 'mug', 'bottle', 'container']
        if any(keyword in class_name_lower for keyword in container_keywords):
            # Containers are acceptable if they might contain food
            return True
        
        # Reject if it's clearly not food
        return False
    
    def validate_food_detections(self, detections: List[Dict]) -> Tuple[List[Dict], bool]:
        """
        Filter detections to only include food-related items
        
        Args:
            detections: List of detection results
            
        Returns:
            Tuple of (filtered_detections, is_valid_food)
        """
        if not detections:
            return [], False
        
        food_detections = []
        non_food_detections = []
        
        for det in detections:
            class_name = det.get('class_name', '').lower()
            confidence = det.get('confidence', 0)
            
            # Only consider detections with reasonable confidence
            if confidence < 0.3:
                continue
            
            if self.is_food_item(det.get('class_name', '')):
                food_detections.append(det)
            else:
                non_food_detections.append(det)
        
        # If we have food detections, use them
        if food_detections:
            return food_detections, True
        
        # If we only have non-food detections, reject
        if non_food_detections:
            detected_names = [det.get('class_name', 'unknown') for det in non_food_detections]
            print(f"⚠️  Non-food items detected: {detected_names}")
            return [], False
        
        # No confident detections
        return [], False
    
    def get_item_name(self, detections: List[Dict], image: np.ndarray = None) -> str:
        """
        Generate item name from detections using actual detected class names
        
        Args:
            detections: List of detection results with class_name field
            image: Optional image array for visual analysis
            
        Returns:
            Item name string (e.g., "Rice and Curry", "Chappati", "Mixed Food")
        """
        if not detections:
            return "Food Item"
        
        # Extract unique class names from detections (with confidence > 0.3)
        detected_items = []
        container_items = []
        
        for det in detections:
            if det.get('confidence', 0) > 0.3:  # Only include confident detections
                class_name = det.get('class_name', '').lower()
                if class_name:
                    # Separate containers from actual food items
                    if class_name in ['bowl', 'plate', 'dish', 'container', 'cup', 'mug']:
                        container_items.append(class_name)
                    elif class_name not in detected_items:
                        detected_items.append(class_name)
        
        # If no confident detections, use all detections
        if not detected_items and not container_items:
            for det in detections:
                class_name = det.get('class_name', '').lower()
                if class_name:
                    if class_name in ['bowl', 'plate', 'dish', 'container', 'cup', 'mug']:
                        container_items.append(class_name)
                    elif class_name not in detected_items:
                        detected_items.append(class_name)
            detected_items = list(dict.fromkeys(detected_items))
            container_items = list(dict.fromkeys(container_items))
        
        # If we only have containers and no actual food items, try to infer from image
        # Also try inference if we have very generic detections
        should_infer = (
            (not detected_items and container_items) or
            (detected_items and all(item in ['bowl', 'plate', 'dish', 'container'] for item in detected_items))
        )
        
        if should_infer and image is not None:
            inferred_name = self._infer_food_from_image(image)
            if inferred_name:
                print(f"✅ Inferred food name from image analysis: {inferred_name}")
                return inferred_name
        
        # If we only have containers, return a generic but descriptive name
        if not detected_items and container_items:
            # Check if we can infer from container type
            if 'plate' in container_items:
                return "Cooked Meal"
            elif 'bowl' in container_items:
                return "Prepared Food"
            else:
                return "Food Item"
        
        # Format the item name based on detected items
        if not detected_items:
            return "Food Item"
        elif len(detected_items) == 1:
            # Single item detected - capitalize and format nicely
            item = detected_items[0].replace('_', ' ').title()
            # Map common variations
            item = self._normalize_food_name(item)
            return item
        elif len(detected_items) == 2:
            # Two items - format as "Item1 and Item2"
            item1 = detected_items[0].replace('_', ' ').title()
            item2 = detected_items[1].replace('_', ' ').title()
            item1 = self._normalize_food_name(item1)
            item2 = self._normalize_food_name(item2)
            return f"{item1} and {item2}"
        else:
            # Multiple items - format as "Item1, Item2, and Item3"
            formatted_items = [self._normalize_food_name(item.replace('_', ' ').title()) for item in detected_items]
            if len(formatted_items) <= 3:
                return ", ".join(formatted_items[:-1]) + f", and {formatted_items[-1]}"
            else:
                return ", ".join(formatted_items[:2]) + f", and {len(formatted_items) - 2} more items"
    
    def _normalize_food_name(self, name: str) -> str:
        """
        Normalize and improve food names (e.g., handle variations, common misspellings)
        
        Args:
            name: Raw food name
            
        Returns:
            Normalized food name
        """
        name_lower = name.lower()
        
        # Map common variations and improve names
        name_mappings = {
            'bowl': 'Prepared Food',
            'plate': 'Cooked Meal',
            'dish': 'Food Dish',
            'container': 'Food Item',
            'bottle': 'Beverage',
            'cup': 'Beverage',
            'mug': 'Beverage',
            # Indian food variations
            'roti': 'Chappati',
            'chapati': 'Chappati',
            'chapathi': 'Chappati',
            'chappati': 'Chappati',
            'naan': 'Naan Bread',
            'dosa': 'Dosa',
            'idli': 'Idli',
            'sambar': 'Sambar',
            'dal': 'Dal',
            'biryani': 'Biryani',
            'pulao': 'Pulao',
            'pulav': 'Pulao',
        }
        
        # Check for exact matches first
        if name_lower in name_mappings:
            return name_mappings[name_lower]
        
        # Check for partial matches
        for key, value in name_mappings.items():
            if key in name_lower:
                return value
        
        # Return original name if no mapping found
        return name
    
    def _infer_food_from_image(self, image: np.ndarray) -> str:
        """
        Try to infer food type from image characteristics when only containers are detected
        Uses advanced computer vision techniques to identify food items
        
        Args:
            image: Image array
            
        Returns:
            Inferred food name or None
        """
        try:
            print("🔍 Starting advanced image analysis for food classification...")
            
            # Resize for faster processing
            height, width = image.shape[:2]
            if width > 800:
                scale = 800 / width
                new_width = 800
                new_height = int(height * scale)
                image = cv2.resize(image, (new_width, new_height))
            
            # Convert to different color spaces for analysis
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
            lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
            
            total_pixels = image.shape[0] * image.shape[1]
            
            # 1. Check for circular/flat bread items (Chappati, Roti, Naan)
            circles = cv2.HoughCircles(
                gray,
                cv2.HOUGH_GRADIENT,
                dp=1,
                minDist=min(image.shape[0], image.shape[1]) // 4,
                param1=50,
                param2=30,
                minRadius=20,
                maxRadius=min(image.shape[0], image.shape[1]) // 3
            )
            
            if circles is not None and len(circles[0]) >= 1:
                num_circles = len(circles[0])
                print(f"🔍 Detected {num_circles} circular patterns")
                if num_circles >= 2:
                    return "Chappati (Multiple)"
                else:
                    return "Chappati"
            
            # 2. Analyze color distribution for different food types
            # Yellow/Orange range (Curry, Dal, Sambar)
            yellow_lower = np.array([15, 100, 100])
            yellow_upper = np.array([35, 255, 255])
            yellow_mask = cv2.inRange(hsv, yellow_lower, yellow_upper)
            yellow_pixels = cv2.countNonZero(yellow_mask)
            yellow_ratio = yellow_pixels / total_pixels
            
            # Orange/Red range (Spicy curry, Biryani)
            orange_lower = np.array([5, 100, 100])
            orange_upper = np.array([25, 255, 255])
            orange_mask = cv2.inRange(hsv, orange_lower, orange_upper)
            orange_pixels = cv2.countNonZero(orange_mask)
            orange_ratio = orange_pixels / total_pixels
            
            # Brown/Tan range (Rice, Bread, Chappati)
            brown_lower = np.array([10, 50, 50])
            brown_upper = np.array([25, 255, 200])
            brown_mask = cv2.inRange(hsv, brown_lower, brown_upper)
            brown_pixels = cv2.countNonZero(brown_mask)
            brown_ratio = brown_pixels / total_pixels
            
            # White/Cream range (Rice, Idli, Dosa)
            white_lower = np.array([0, 0, 200])
            white_upper = np.array([180, 30, 255])
            white_mask = cv2.inRange(hsv, white_lower, white_upper)
            white_pixels = cv2.countNonZero(white_mask)
            white_ratio = white_pixels / total_pixels
            
            # Green range (Vegetables, Sabzi)
            green_lower = np.array([40, 50, 50])
            green_upper = np.array([80, 255, 255])
            green_mask = cv2.inRange(hsv, green_lower, green_upper)
            green_pixels = cv2.countNonZero(green_mask)
            green_ratio = green_pixels / total_pixels
            
            print(f"🔍 Color analysis - Yellow: {yellow_ratio:.2%}, Orange: {orange_ratio:.2%}, Brown: {brown_ratio:.2%}, White: {white_ratio:.2%}, Green: {green_ratio:.2%}")
            
            # 3. Texture analysis using edge detection
            edges = cv2.Canny(gray, 50, 150)
            edge_density = cv2.countNonZero(edges) / total_pixels
            
            # 4. Analyze image structure (grainy = rice, smooth = curry)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            print(f"🔍 Texture analysis - Edge density: {edge_density:.2%}, Laplacian variance: {laplacian_var:.2f}")
            
            # 5. Decision logic based on multiple features
            food_scores = {}
            
            # Chappati/Roti detection
            if brown_ratio > 0.15 and edge_density < 0.1:
                food_scores['Chappati'] = brown_ratio * 0.7 + (1 - edge_density) * 0.3
            
            # Rice detection
            if white_ratio > 0.2 and edge_density > 0.15:
                food_scores['Rice'] = white_ratio * 0.6 + edge_density * 0.4
            
            # Curry/Dal detection
            if yellow_ratio > 0.15 or orange_ratio > 0.15:
                curry_score = max(yellow_ratio, orange_ratio)
                if edge_density < 0.12:  # Smooth texture
                    food_scores['Curry or Dal'] = curry_score * 0.8 + (1 - edge_density) * 0.2
                else:
                    food_scores['Sambar'] = curry_score * 0.7 + edge_density * 0.3
            
            # Biryani detection (mixed colors, medium texture)
            if (yellow_ratio + orange_ratio) > 0.1 and brown_ratio > 0.1 and 0.1 < edge_density < 0.2:
                food_scores['Biryani'] = (yellow_ratio + orange_ratio + brown_ratio) / 3
            
            # Dosa/Idli detection (white with some texture)
            if white_ratio > 0.25 and 0.08 < edge_density < 0.18:
                food_scores['Dosa or Idli'] = white_ratio * 0.7 + edge_density * 0.3
            
            # Vegetable dish detection
            if green_ratio > 0.15:
                food_scores['Vegetable Dish'] = green_ratio
            
            # Select best match
            if food_scores:
                best_food = max(food_scores.items(), key=lambda x: x[1])
                print(f"✅ Best match: {best_food[0]} (confidence: {best_food[1]:.2%})")
                return best_food[0]
            
            # Fallback: Generic classification based on dominant color
            color_ratios = {
                'Yellow/Orange (Curry/Dal)': yellow_ratio + orange_ratio,
                'Brown (Bread/Chappati)': brown_ratio,
                'White (Rice)': white_ratio,
                'Green (Vegetables)': green_ratio
            }
            
            dominant_color = max(color_ratios.items(), key=lambda x: x[1])
            if dominant_color[1] > 0.1:
                print(f"✅ Fallback classification: {dominant_color[0]}")
                return dominant_color[0]
            
            print("⚠️  Could not determine food type from image")
            return None
            
        except Exception as e:
            print(f"⚠️  Error inferring food from image: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def analyze_image(self, image_url: str) -> Dict:
        """
        Complete image analysis pipeline
        
        Args:
            image_url: URL of the image to analyze
            
        Returns:
            Dictionary with all predictions
        """
        try:
            # Download image
            image = self.download_image(image_url)
            
            # Run detection
            detection_results = self.detect_food(image)
            all_detections = detection_results['detections']
            
            # Log all detected items for debugging
            if all_detections:
                detected_class_names = [det.get('class_name', 'unknown') for det in all_detections]
                detected_confidences = [f"{det.get('confidence', 0):.2f}" for det in all_detections]
                print(f"🔍 All detected items: {list(zip(detected_class_names, detected_confidences))}")
            else:
                print("⚠️  No items detected in image")
            
            # Validate and filter to only food items
            food_detections, is_valid_food = self.validate_food_detections(all_detections)
            
            if not is_valid_food:
                # Non-food items detected - raise exception
                detected_names = [det.get('class_name', 'unknown') for det in all_detections[:3]]
                error_msg = f"Non-food items detected in image: {', '.join(detected_names)}. Please upload an image of food items only."
                print(f"❌ {error_msg}")
                raise ValueError(error_msg)
            
            if not food_detections:
                # No food items detected
                error_msg = "No food items detected in the image. Please ensure the image contains visible food items."
                print(f"❌ {error_msg}")
                raise ValueError(error_msg)
            
            print(f"✅ Valid food items detected: {[det.get('class_name', 'unknown') for det in food_detections]}")
            
            # Use only food detections for analysis
            detections = food_detections
            
            # Extract information
            food_category = self.get_food_category(detections)
            
            # Always try to get a better item name using image analysis
            print("🔍 Attempting to identify specific food item from image...")
            item_name = self.get_item_name(detections, image)  # Pass image for inference
            
            # If we still have a generic name, try one more time with more aggressive inference
            if item_name in ['Food Item', 'Cooked Meal', 'Prepared Food', 'Food Dish']:
                print("⚠️  Got generic name, trying more aggressive image analysis...")
                inferred = self._infer_food_from_image(image)
                if inferred:
                    item_name = inferred
                    print(f"✅ Updated item name to: {item_name}")
            
            quantity = self.estimate_quantity(detections)
            quality_info = self.assess_quality(image, detections)
            
            print(f"📝 Final item name: {item_name}")
            print(f"📊 Category: {food_category}, Quantity: {quantity}, Quality: {quality_info['freshness']}")
            
            # Get storage recommendation
            storage_recommendation = self.STORAGE_MAP.get(
                food_category.lower().replace(' ', '_'),
                'Hot'
            )
            
            # Calculate overall confidence
            if detections:
                confidence = sum(d['confidence'] for d in detections) / len(detections)
            else:
                confidence = 0.5  # Low confidence if nothing detected
            
            # Get detected items list with actual names
            detected_items = []
            for det in detections:
                class_name = det.get('class_name', f"item_{det.get('class', 'unknown')}")
                if class_name and class_name not in detected_items:
                    detected_items.append(class_name.replace('_', ' ').title())
            
            # If no items detected, use generic placeholder
            if not detected_items:
                detected_items = ["Food Item"]
            
            return {
                'foodCategory': food_category,
                'itemName': item_name,
                'quantity': quantity,
                'qualityScore': quality_info['qualityScore'],
                'freshness': quality_info['freshness'],
                'storageRecommendation': storage_recommendation,
                'confidence': float(confidence),
                'detectedItems': detected_items
            }
            
        except ValueError as e:
            # Re-raise validation errors (non-food items detected)
            print(f"Validation error: {e}")
            raise e
        except Exception as e:
            print(f"Error in analyze_image: {e}")
            # Return default predictions on error (only for unexpected errors)
            return {
                'foodCategory': 'Cooked Meals',
                'itemName': 'Food Item',
                'quantity': 1,
                'qualityScore': 0.75,
                'freshness': 'Good',
                'storageRecommendation': 'Hot',
                'confidence': 0.5,
                'detectedItems': []
            }
