import { getAuthHeaders } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Dispatched when user views notifications page and marks all as read (for navbar badge refresh). */
export const NOTIFICATIONS_READ_EVENT = 'foodloop-notifications-read';

/**
 * Get all notifications (admin only)
 */
export const getAdminNotifications = async () => {
  const response = await fetch(`${API_URL}/api/admin/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to fetch notifications');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Create a notification (admin only)
 * @param {{ message: string, title?: string, roles: string[] }} payload - message (required), optional title, roles: ['Donor'|'Receiver'|'Driver'|'All'] (at least one)
 */
export const createNotification = async ({ message, title, roles }) => {
  const response = await fetch(`${API_URL}/api/admin/notifications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message: message?.trim(),
      ...(title?.trim() && { title: title.trim() }),
      roles: roles && roles.length ? roles : undefined,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to create notification');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Get notifications for the current user (role-filtered; any logged-in user)
 * Response includes notifications (with read flag) and unreadCount.
 */
export const getMyNotifications = async () => {
  const response = await fetch(`${API_URL}/api/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to fetch notifications');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Get unread notification count (lightweight, for navbar badge).
 */
export const getUnreadCount = async () => {
  const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to fetch unread count');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Mark notifications as read.
 * @param {{ all?: boolean, notificationIds?: string[] }} payload - all: true to mark all, or notificationIds array
 */
export const markAsRead = async ({ all, notificationIds } = {}) => {
  const response = await fetch(`${API_URL}/api/notifications/mark-read`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...(all === true && { all: true }),
      ...(Array.isArray(notificationIds) && notificationIds.length > 0 && { notificationIds }),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to mark as read');
    err.response = { data };
    throw err;
  }
  return data;
};
