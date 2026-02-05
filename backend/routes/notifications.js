const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const NotificationRead = require('../models/NotificationRead');
const { authenticateUser } = require('../middleware/auth');

router.use(express.json());

/**
 * GET /api/notifications
 * List notifications for the current user's role (authenticated).
 * Returns active notifications with read flag and unreadCount.
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userRole = req.user && req.user.role;
    const userId = req.user && req.user.id;
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'User role not found',
      });
    }

    const notifications = await Notification.find({
      status: 'active',
      $or: [
        { targetRoles: 'All' },
        { targetRoles: userRole },
      ],
    })
      .sort({ createdAt: -1 })
      .select('title message createdAt _id')
      .lean();

    const notificationIds = notifications.map((n) => n._id);
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
    let readSet = new Set();
    if (userObjectId && notificationIds.length > 0) {
      const reads = await NotificationRead.find({
        user: userObjectId,
        notification: { $in: notificationIds },
      })
        .select('notification')
        .lean();
      reads.forEach((r) => readSet.add(r.notification.toString()));
    }

    let unreadCount = 0;
    const list = notifications.map((n) => {
      const read = readSet.has(n._id.toString());
      if (!read) unreadCount += 1;
      return {
        id: n._id.toString(),
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        read,
      };
    });

    res.status(200).json({
      success: true,
      count: list.length,
      unreadCount,
      notifications: list,
    });
  } catch (error) {
    console.error('[Notifications] Error fetching user notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/notifications/unread-count
 * Returns unread notification count for current user (lightweight for navbar).
 */
router.get('/unread-count', authenticateUser, async (req, res) => {
  try {
    const userRole = req.user && req.user.role;
    const userId = req.user && req.user.id;
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'User role not found',
      });
    }

    const notifications = await Notification.find({
      status: 'active',
      $or: [
        { targetRoles: 'All' },
        { targetRoles: userRole },
      ],
    })
      .select('_id')
      .lean();

    const notificationIds = notifications.map((n) => n._id);
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
    let readCount = 0;
    if (userObjectId && notificationIds.length > 0) {
      readCount = await NotificationRead.countDocuments({
        user: userObjectId,
        notification: { $in: notificationIds },
      });
    }
    const unreadCount = notificationIds.length - readCount;

    res.status(200).json({
      success: true,
      unreadCount: Math.max(0, unreadCount),
    });
  } catch (error) {
    console.error('[Notifications] Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/notifications/mark-read
 * Body: { all?: boolean, notificationIds?: string[] }
 * Mark notifications as read for current user.
 */
router.post('/mark-read', authenticateUser, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const userRole = req.user && req.user.role;
    if (!userId || !userRole) {
      return res.status(403).json({
        success: false,
        message: 'User not found',
      });
    }

    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
    if (!userObjectId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user',
      });
    }

    const { all, notificationIds } = req.body || {};
    let idsToMark = [];

    if (all === true) {
      const notifications = await Notification.find({
        status: 'active',
        $or: [
          { targetRoles: 'All' },
          { targetRoles: userRole },
        ],
      })
        .select('_id')
        .lean();
      idsToMark = notifications.map((n) => n._id);
    } else if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      const valid = notificationIds
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));
      idsToMark = valid;
    }

    if (idsToMark.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nothing to mark as read',
        marked: 0,
      });
    }

    const ops = idsToMark.map((notificationId) => ({
      updateOne: {
        filter: { user: userObjectId, notification: notificationId },
        update: { $setOnInsert: { user: userObjectId, notification: notificationId, readAt: new Date() } },
        upsert: true,
      },
    }));

    const result = await NotificationRead.bulkWrite(ops);

    res.status(200).json({
      success: true,
      message: 'Marked as read',
      marked: result.upsertedCount + result.modifiedCount,
    });
  } catch (error) {
    console.error('[Notifications] Error marking as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
