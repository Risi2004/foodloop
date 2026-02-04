const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');

// Apply JSON body parser and authentication to all routes
router.use(express.json());
router.use(authenticateUser);

/**
 * PATCH /api/users/me/location
 * Update current user's location (for drivers)
 * Requires authentication
 */
router.patch('/me/location', async (req, res) => {
  try {
    // Check if user is a Driver
    if (req.user.role !== 'Driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can update their location',
      });
    }

    const { latitude, longitude } = req.body;

    // Validate inputs
    if (latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        errors: [
          { field: 'latitude', message: 'Latitude is required' },
          { field: 'longitude', message: 'Longitude is required' },
        ],
      });
    }

    // Validate coordinate types
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers',
        errors: [
          { field: 'latitude', message: 'Latitude must be a valid number' },
          { field: 'longitude', message: 'Longitude must be a valid number' },
        ],
      });
    }

    // Validate coordinates are within Sri Lanka bounds
    // Sri Lanka is approximately: lat 5.9-9.8, lng 79.7-81.9
    if (lat < 5 || lat > 10 || lng < 79 || lng > 82) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates are outside Sri Lanka bounds',
        errors: [
          { field: 'latitude', message: 'Latitude must be between 5 and 10' },
          { field: 'longitude', message: 'Longitude must be between 79 and 82' },
        ],
      });
    }

    // Find and update user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update location
    user.driverLatitude = lat;
    user.driverLongitude = lng;
    await user.save();

    console.log(`[Users] Driver location updated: ${req.user.id} -> [${lat}, ${lng}]`);

    // Prepare response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      location: {
        latitude: user.driverLatitude,
        longitude: user.driverLongitude,
      },
      user: userResponse,
    });
  } catch (error) {
    console.error('[Users] Error updating driver location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
