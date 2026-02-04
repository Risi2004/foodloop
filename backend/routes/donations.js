const express = require('express');
const router = express.Router();
const { handleFileUpload } = require('../middleware/upload');
const { uploadDonationImageToS3 } = require('../config/awsS3');
const { analyzeFoodImage } = require('../services/aiService');
const { AI_SERVICE_URL } = require('../config/env');
const { authenticateUser } = require('../middleware/auth');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { calculateExpiryDate } = require('../services/expiryService');
const { sendDonationLiveEmail } = require('../utils/emailService');
const { geocodeAddress } = require('../services/geocodingService');

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
    
    // Handle validation errors (AI-generated images or non-food items detected)
    if (error.message.includes('AI-generated') || 
        error.message.includes('ai-generated') ||
        error.message.includes('synthetic') ||
        error.message.includes('fake') ||
        error.message.includes('computer-generated')) {
      return res.status(400).json({
        success: false,
        message: 'AI-generated images are not allowed. Please upload a real photo of food.',
        errors: [{ field: 'image', message: 'AI-generated images are not allowed. Please upload a real photo of food.' }],
      });
    }
    
    // Handle non-food items errors
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
    
    // Handle temporary AI service errors - allow users to proceed without AI verification
    // This includes rate limits, timeouts, and service unavailability
    if (error.message.includes('rate limit') || 
        error.message.includes('quota') || 
        error.message.includes('429') ||
        error.message.includes('AI service') || 
        error.message.includes('timeout') || 
        error.message.includes('not available') ||
        error.message.includes('temporarily unavailable')) {
      // Return success with image URL but no predictions - user can fill form manually
      console.log('[Donations] AI service unavailable, allowing user to proceed with image upload');
      return res.status(200).json({
        success: true,
        predictions: null, // No AI predictions available
        imageUrl: imageUrl, // Image was uploaded successfully
        message: 'Image uploaded successfully. AI analysis is temporarily unavailable. Please fill the form manually.',
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
      preferredPickupTimeFrom,
      preferredPickupTimeTo,
      aiConfidence,
      aiQualityScore,
      aiFreshness,
      aiDetectedItems,
      productType,
      expiryDateFromPackage,
      userProvidedExpiryDate,
      donorLatitude,
      donorLongitude,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      foodCategory,
      itemName,
      quantity,
      storageRecommendation,
      imageUrl,
      preferredPickupDate,
      preferredPickupTimeFrom,
      preferredPickupTimeTo,
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

    // Validate pickup date (should be a valid date string)
    let pickupDate;
    try {
      pickupDate = new Date(preferredPickupDate);
      if (isNaN(pickupDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'preferredPickupDate', message: 'Invalid pickup date format' }],
      });
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({
        success: false,
        errors: [{ field: 'quantity', message: 'Quantity must be a positive number' }],
      });
    }

    // Fetch donor details (address, email) from User model
    const donor = await User.findById(req.user.id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    // Validate donor has required fields
    if (!donor.address) {
      return res.status(400).json({
        success: false,
        message: 'Donor address is missing. Please update your profile with an address.',
      });
    }

    if (!donor.email) {
      return res.status(400).json({
        success: false,
        message: 'Donor email is missing. Please update your profile.',
      });
    }

    // Determine product type (from AI or default to 'cooked')
    const finalProductType = productType === 'packed' ? 'packed' : 'cooked';
    
    // Parse expiry date from package (if provided)
    let parsedExpiryFromPackage = null;
    if (expiryDateFromPackage) {
      try {
        parsedExpiryFromPackage = new Date(expiryDateFromPackage);
        if (isNaN(parsedExpiryFromPackage.getTime())) {
          parsedExpiryFromPackage = null;
        }
      } catch (error) {
        parsedExpiryFromPackage = null;
      }
    }
    
    // Use user-provided expiry if AI didn't detect it and user provided one
    if (!parsedExpiryFromPackage && userProvidedExpiryDate) {
      try {
        parsedExpiryFromPackage = new Date(userProvidedExpiryDate);
        if (isNaN(parsedExpiryFromPackage.getTime())) {
          parsedExpiryFromPackage = null;
        }
      } catch (error) {
        parsedExpiryFromPackage = null;
      }
    }

    // Calculate expiry date
    const expiryDate = calculateExpiryDate({
      productType: finalProductType,
      expiryDateFromPackage: parsedExpiryFromPackage,
      userProvidedExpiryDate: userProvidedExpiryDate ? new Date(userProvidedExpiryDate) : null,
      createdAt: new Date(),
    });

    // Determine coordinates: Use donor-confirmed coordinates if provided, otherwise geocode address
    let finalLatitude = null;
    let finalLongitude = null;

    if (donorLatitude && donorLongitude) {
      // Validate coordinates are within Sri Lanka bounds
      if (donorLatitude >= 5 && donorLatitude <= 10 && 
          donorLongitude >= 79 && donorLongitude <= 82) {
        finalLatitude = donorLatitude;
        finalLongitude = donorLongitude;
        console.log(`[Donations] Using donor-confirmed coordinates: [${finalLatitude}, ${finalLongitude}]`);
      } else {
        console.warn(`[Donations] Donor-provided coordinates [${donorLatitude}, ${donorLongitude}] are outside Sri Lanka bounds, will geocode address instead`);
      }
    }

    // If no valid donor coordinates, geocode the address
    if (!finalLatitude || !finalLongitude) {
      if (donor.address) {
        const geocodedCoords = await geocodeAddress(donor.address);
        if (geocodedCoords) {
          finalLatitude = geocodedCoords.lat;
          finalLongitude = geocodedCoords.lng;
          console.log(`[Donations] Geocoded address to coordinates: [${finalLatitude}, ${finalLongitude}]`);
        }
      }
    }

    // Create donation
    const donation = new Donation({
      donorId: req.user.id,
      foodCategory,
      itemName,
      quantity,
      storageRecommendation,
      imageUrl,
      preferredPickupDate: pickupDate,
      preferredPickupTimeFrom,
      preferredPickupTimeTo,
      productType: finalProductType,
      expiryDate,
      expiryDateFromPackage: parsedExpiryFromPackage,
      donorAddress: donor.address,
      donorEmail: donor.email,
      donorLatitude: finalLatitude,
      donorLongitude: finalLongitude,
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
      productType: donation.productType,
      expiryDate: donation.expiryDate,
    });

    // Send email notification (async, don't block response)
    try {
      await sendDonationLiveEmail(donation, donor);
    } catch (emailError) {
      console.error('[Donations] Error sending donation email:', emailError.message);
      // Don't fail donation creation if email fails
    }

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
        expiryDate: donation.expiryDate,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('[Donations] Error creating donation:', error);
    console.error('[Donations] Error stack:', error.stack);
    console.error('[Donations] Request body:', JSON.stringify(req.body, null, 2));
    res.status(500).json({
      success: false,
      message: 'Failed to create donation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * GET /api/donations/available
 * Get all available donations for receivers
 * Returns donations with status 'pending' or 'approved' that haven't expired
 * No authentication required - receivers need to see available donations
 */
router.get('/available', async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Fetch donations with status 'pending' or 'approved' that haven't expired
    const donations = await Donation.find({
      status: { $in: ['pending', 'approved'] },
      expiryDate: { $gt: currentDate }, // Only non-expired donations
    })
      .populate('donorId', 'address email donorType username businessName')
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    // Format donations and geocode addresses
    const formattedDonations = await Promise.all(
      donations.map(async (donation) => {
        const donor = donation.donorId;
        const donorName = donor?.donorType === 'Business' 
          ? donor.businessName 
          : donor?.username || donor?.email || 'Anonymous';

        const donorAddress = donation.donorAddress || donor?.address || '';
        
        // Get coordinates (re-geocode if coordinates seem incorrect, otherwise use stored)
        let coordinates = null;
        
        // Check if stored coordinates are valid and within Sri Lanka bounds
        const hasStoredCoords = donation.donorLatitude && donation.donorLongitude;
        const coordsInBounds = hasStoredCoords && 
          donation.donorLatitude >= 5 && donation.donorLatitude <= 10 &&
          donation.donorLongitude >= 79 && donation.donorLongitude <= 82;
        
        if (hasStoredCoords && coordsInBounds) {
          // Use stored coordinates if they're valid
          coordinates = {
            lat: donation.donorLatitude,
            lng: donation.donorLongitude,
          };
          console.log(`[Donations] Using stored coordinates for donation ${donation._id}: [${coordinates.lat}, ${coordinates.lng}]`);
        } else if (donorAddress) {
          // Re-geocode if no stored coordinates or if stored coordinates are invalid
          if (hasStoredCoords && !coordsInBounds) {
            console.log(`[Donations] Stored coordinates for donation ${donation._id} seem invalid, re-geocoding...`);
          }
          
          // Geocode the address
          coordinates = await geocodeAddress(donorAddress);
          
          // Save coordinates back to database (async, don't block response)
          if (coordinates) {
            Donation.findByIdAndUpdate(
              donation._id,
              {
                donorLatitude: coordinates.lat,
                donorLongitude: coordinates.lng,
              },
              { new: true }
            ).catch(err => {
              console.error(`[Donations] Error saving coordinates for donation ${donation._id}:`, err);
            });
          } else {
            console.warn(`[Donations] Failed to geocode address for donation ${donation._id}: ${donorAddress}`);
          }
        }

        return {
          id: donation._id.toString(),
          trackingId: donation.trackingId,
          // Food details
          itemName: donation.itemName,
          foodCategory: donation.foodCategory,
          quantity: donation.quantity,
          imageUrl: donation.imageUrl,
          expiryDate: donation.expiryDate,
          storageRecommendation: donation.storageRecommendation,
          // Donor details
          donorId: donation.donorId?._id?.toString(),
          donorAddress: donorAddress,
          donorEmail: donation.donorEmail || donor?.email,
          donorName: donorName,
          donorType: donor?.donorType,
          // Coordinates for map
          position: coordinates ? [coordinates.lat, coordinates.lng] : null,
          // Pickup information
          preferredPickupDate: donation.preferredPickupDate,
          preferredPickupTimeFrom: donation.preferredPickupTimeFrom,
          preferredPickupTimeTo: donation.preferredPickupTimeTo,
          // AI analysis data
          aiQualityScore: donation.aiQualityScore,
          aiFreshness: donation.aiFreshness,
          aiConfidence: donation.aiConfidence,
          aiDetectedItems: donation.aiDetectedItems || [],
          // Timestamps
          createdAt: donation.createdAt,
          updatedAt: donation.updatedAt,
        };
      })
    );

    console.log(`[Donations] Returning ${formattedDonations.length} available donations`);

    res.status(200).json({
      success: true,
      donations: formattedDonations,
      count: formattedDonations.length,
    });
  } catch (error) {
    console.error('[Donations] Error fetching available donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available donations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
