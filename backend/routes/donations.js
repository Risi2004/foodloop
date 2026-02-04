const express = require('express');
const router = express.Router();
const { handleFileUpload } = require('../middleware/upload');
const { uploadDonationImageToS3 } = require('../config/awsS3');
const { analyzeFoodImage } = require('../services/aiService');
const { AI_SERVICE_URL } = require('../config/env');
const { authenticateUser } = require('../middleware/auth');
const Donation = require('../models/Donation');

// Apply file upload middleware for image uploads
router.use(express.json());

/**
 * POST /api/donations/upload-image
 * Upload donation image to S3 with lossless quality preservation
 */
router.post('/upload-image', handleFileUpload, async (req, res) => {
  try {
    // Check if image file is present
    if (!req.files || !req.files.image || !req.files.image[0]) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'image', message: 'Image file is required' }],
      });
    }

    const imageFile = req.files.image[0];

    // Validate file type
    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'image', message: 'File must be an image' }],
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'image', message: 'Image size must be less than 10MB' }],
      });
    }

    // Upload to S3 with lossless quality
    const imageUrl = await uploadDonationImageToS3(imageFile);

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading donation image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/donations/analyze-image
 * Analyze food image using AI service
 * Accepts either imageUrl or image file
 */
router.post('/analyze-image', handleFileUpload, async (req, res) => {
  try {
    console.log('[Donations] Analyze image request received');
    let imageUrl = req.body.imageUrl;
    let imageFile = null;

    // Check if image file is provided
    if (req.files && req.files.image && req.files.image[0]) {
      imageFile = req.files.image[0];
      console.log('[Donations] Image file provided:', {
        name: imageFile.originalname,
        size: imageFile.size,
        mimetype: imageFile.mimetype
      });
      
      // Validate file type
      if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          errors: [{ field: 'image', message: 'File must be an image' }],
        });
      }

      // Upload to S3 first if file is provided
      console.log('[Donations] Uploading image to S3...');
      imageUrl = await uploadDonationImageToS3(imageFile);
      console.log('[Donations] Image uploaded to S3:', imageUrl);
    }

    // Validate that we have an image URL
    if (!imageUrl) {
      console.error('[Donations] No image URL provided');
      return res.status(400).json({
        success: false,
        errors: [{ field: 'imageUrl', message: 'Image URL or image file is required' }],
      });
    }

    // Call AI service for analysis
    console.log('[Donations] Calling AI service for analysis...');
    const predictions = await analyzeFoodImage(imageUrl);
    console.log('[Donations] AI analysis complete:', {
      foodCategory: predictions.foodCategory,
      itemName: predictions.itemName,
      quantity: predictions.quantity,
      confidence: predictions.confidence
    });

    res.status(200).json({
      success: true,
      predictions: predictions,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error('[Donations] Error analyzing image:', error.message);
    console.error('[Donations] Error stack:', error.stack);
    
    // Handle validation errors (non-food items detected)
    if (error.message.includes('does not contain food') || 
        error.message.includes('Non-food items') || 
        error.message.includes('No food items') ||
        error.message.includes('not related to food')) {
      return res.status(400).json({
        success: false,
        message: 'This image is not related to food items. Please upload an image of food only.',
        errors: [{ field: 'image', message: 'This image is not related to food items. Please upload an image of food only.' }],
      });
    }
    
    // Handle AI service errors gracefully
    if (error.message.includes('AI service') || error.message.includes('timeout') || error.message.includes('not available')) {
      return res.status(503).json({
        success: false,
        message: 'AI service is temporarily unavailable. Please fill the form manually.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to analyze image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/donations/ai-service-status
 * Check AI service connectivity and status
 */
router.get('/ai-service-status', async (req, res) => {
  try {
    const status = {
      configured: !!AI_SERVICE_URL,
      url: AI_SERVICE_URL || 'Not configured',
      timestamp: new Date().toISOString(),
    };

    // Try to connect to AI service
    if (AI_SERVICE_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check

        const response = await fetch(`${AI_SERVICE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const healthData = await response.json();
          status.connected = true;
          status.health = healthData;
        } else {
          status.connected = false;
          status.error = `Health check returned status ${response.status}`;
        }
      } catch (error) {
        status.connected = false;
        status.error = error.message;
      }
    } else {
      status.connected = false;
      status.error = 'AI service URL not configured';
    }

    res.status(200).json({
      success: true,
      status: status,
    });
  } catch (error) {
    console.error('[Donations] Error checking AI service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check AI service status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/donations
 * Create a new donation
 * Requires authentication (Donor role)
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    // Check if user is a Donor
    if (req.user.role !== 'Donor') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can create donations',
      });
    }

    const {
      foodCategory,
      itemName,
      quantity,
      storageRecommendation,
      imageUrl,
      preferredPickupDate,
      aiConfidence,
      aiQualityScore,
      aiFreshness,
      aiDetectedItems,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      foodCategory,
      itemName,
      quantity,
      storageRecommendation,
      imageUrl,
      preferredPickupDate,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: missingFields.map(field => ({
          field,
          message: `${field} is required`,
        })),
      });
    }

    // Validate enum values
    const validCategories = ['Cooked Meals', 'Raw Food', 'Beverages', 'Snacks', 'Desserts'];
    if (!validCategories.includes(foodCategory)) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'foodCategory', message: 'Invalid food category' }],
      });
    }

    const validStorage = ['Hot', 'Cold', 'Dry'];
    if (!validStorage.includes(storageRecommendation)) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'storageRecommendation', message: 'Invalid storage recommendation' }],
      });
    }

    const validPickupDates = ['today', 'tomorrow'];
    if (!validPickupDates.includes(preferredPickupDate)) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'preferredPickupDate', message: 'Invalid pickup date preference' }],
      });
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'quantity', message: 'Quantity must be a positive number' }],
      });
    }

    // Create donation
    const donation = new Donation({
      donorId: req.user.id,
      foodCategory,
      itemName,
      quantity,
      storageRecommendation,
      imageUrl,
      preferredPickupDate,
      aiConfidence: aiConfidence || null,
      aiQualityScore: aiQualityScore || null,
      aiFreshness: aiFreshness || null,
      aiDetectedItems: Array.isArray(aiDetectedItems) ? aiDetectedItems : [],
      status: 'pending',
    });

    await donation.save();

    console.log('[Donations] Donation created successfully:', {
      donationId: donation._id,
      trackingId: donation.trackingId,
      donorId: donation.donorId,
      itemName: donation.itemName,
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      donation: {
        id: donation._id,
        trackingId: donation.trackingId,
        foodCategory: donation.foodCategory,
        itemName: donation.itemName,
        quantity: donation.quantity,
        status: donation.status,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('[Donations] Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
