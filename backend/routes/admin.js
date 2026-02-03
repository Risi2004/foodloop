const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateAdmin } = require('../middleware/auth');
const { sendApprovalEmail, sendRejectionEmail, sendDeactivationEmail, sendActivationEmail } = require('../utils/emailService');

// Apply JSON body parser and admin authentication to all routes
router.use(express.json());
router.use(authenticateAdmin);

/**
 * GET /api/admin/users/pending
 * Fetch all users with status: 'pending'
 * Returns users sorted by createdAt (newest first)
 */
router.get('/users/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Return plain JavaScript objects

    // Format user data for frontend
    const formattedUsers = pendingUsers.map(user => {
      const userData = {
        _id: user._id,
        email: user.email,
        role: user.role,
        contactNo: user.contactNo,
        address: user.address,
        profileImageUrl: user.profileImageUrl,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Add role-specific fields
      if (user.role === 'Donor') {
        userData.donorType = user.donorType;
        userData.username = user.username;
        userData.businessName = user.businessName;
        userData.businessType = user.businessType;
      } else if (user.role === 'Receiver') {
        userData.receiverName = user.receiverName;
        userData.receiverType = user.receiverType;
      } else if (user.role === 'Driver') {
        userData.driverName = user.driverName;
        userData.vehicleNumber = user.vehicleNumber;
        userData.vehicleType = user.vehicleType;
      }

      // IMPORTANT: Include ALL document fields regardless of role
      // This ensures we show all documents that were uploaded during signup
      userData.businessRegFileUrl = user.businessRegFileUrl;
      userData.addressProofFileUrl = user.addressProofFileUrl;
      userData.nicFileUrl = user.nicFileUrl;
      userData.licenseFileUrl = user.licenseFileUrl;

      return userData;
    });

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * PATCH /api/admin/users/:id/status
 * Update user status (approve or reject)
 * Body: { status: 'completed' | 'rejected' }
 */
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    // Debug: Log the received status
    console.log('Received status update request:', { id, status, body: req.body, statusType: typeof status });

    // Normalize status (trim whitespace and convert to lowercase)
    if (status && typeof status === 'string') {
      status = status.trim().toLowerCase();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be a string',
      });
    }

    // Validate status value (all enum values are lowercase)
    const validStatuses = ['completed', 'rejected', 'inactive'];
    if (!validStatuses.includes(status)) {
      console.error('Invalid status received:', status, 'Type:', typeof status, 'Body:', req.body);
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}. Received: ${status || 'undefined'}`,
      });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Save previous status before updating
    const previousStatus = user.status;

    // Update status
    user.status = status;
    await user.save();

    // Send email notification based on status change
    try {
      if (status === 'completed') {
        // Check if user was previously inactive (reactivation) or pending (new approval)
        if (previousStatus === 'inactive') {
          await sendActivationEmail(user);
        } else {
          await sendApprovalEmail(user);
        }
      } else if (status === 'rejected') {
        await sendRejectionEmail(user);
      } else if (status === 'inactive') {
        await sendDeactivationEmail(user);
      }
    } catch (emailError) {
      // Log email error but don't fail status update
      console.error('Email sending error (admin status update):', emailError.message);
    }

    // Prepare response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: `User ${status === 'completed' ? 'approved' : 'rejected'} successfully`,
      user: userResponse,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/admin/users
 * Fetch all users with optional filters
 * Query params: status, role
 */
router.get('/users', async (req, res) => {
  try {
    const { status, role } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Format user data
    const formattedUsers = users.map(user => {
      const userData = {
        _id: user._id,
        email: user.email,
        role: user.role,
        contactNo: user.contactNo,
        address: user.address,
        profileImageUrl: user.profileImageUrl,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Add role-specific fields
      if (user.role === 'Donor') {
        userData.donorType = user.donorType;
        userData.username = user.username;
        userData.businessName = user.businessName;
        userData.businessType = user.businessType;
      } else if (user.role === 'Receiver') {
        userData.receiverName = user.receiverName;
        userData.receiverType = user.receiverType;
      } else if (user.role === 'Driver') {
        userData.driverName = user.driverName;
        userData.vehicleNumber = user.vehicleNumber;
        userData.vehicleType = user.vehicleType;
      }

      // IMPORTANT: Include ALL document fields regardless of role
      // This ensures we show all documents that were uploaded during signup
      userData.businessRegFileUrl = user.businessRegFileUrl;
      userData.addressProofFileUrl = user.addressProofFileUrl;
      userData.nicFileUrl = user.nicFileUrl;
      userData.licenseFileUrl = user.licenseFileUrl;

      return userData;
    });

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
