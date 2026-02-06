import { getAuthHeaders, getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const signup = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Signup failed');
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error.response) {
      throw error;
    }
    // Otherwise, wrap it
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { errors: [{ field: 'submit', message: wrappedError.message }] } };
    throw wrappedError;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Login failed');
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { errors: [{ field: 'submit', message: wrappedError.message }] } };
    throw wrappedError;
  }
};

/**
 * Request password reset; sends reset link to email if account exists
 * @param {string} email - User email
 * @returns {Promise} { success, message }
 */
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email?.trim() }),
  });
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to request reset');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Reset password using token from email link
 * @param {string} token - Reset token from URL
 * @param {string} newPassword - New password
 * @returns {Promise} { success, message }
 */
export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token?.trim(), newPassword: newPassword?.trim() }),
  });
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to reset password');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Change password (authenticated user: current + new password).
 * Backend updates DB and sends "password changed" email.
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise} { success, message }
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      currentPassword: currentPassword?.trim(),
      newPassword: newPassword?.trim(),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'Failed to change password');
    err.response = { data };
    throw err;
  }
  return data;
};

/**
 * Get admin dashboard stats (donors, drivers, receivers, pending counts)
 * @returns {Promise} { success, stats: { donors, drivers, receivers, pending } }
 */
export const getAdminStats = async () => {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch dashboard stats');
    error.response = { status: response.status, data };
    throw error;
  }
  return data;
};

/**
 * Get all pending users (for admin)
 * @returns {Promise} Response with pending users array
 */
export const getPendingUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/admin/users/pending`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      const error = new Error('Server returned non-JSON response. Please check if the backend is running.');
      error.response = { 
        status: response.status,
        data: { message: 'Server error - invalid response format' } 
      };
      throw error;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch pending users');
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    // Handle network errors or JSON parsing errors
    if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
      const wrappedError = new Error('Server connection error. Please ensure the backend server is running.');
      wrappedError.response = { status: 500, data: { message: wrappedError.message } };
      throw wrappedError;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { status: 0, data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Update user status (approve or reject)
 * @param {string} userId - User ID
 * @param {string} status - 'completed' (approve) or 'rejected' (reject)
 * @returns {Promise} Response with updated user data
 */
export const updateUserStatus = async (userId, status) => {
  try {
    // Validate status before sending
    if (!status || typeof status !== 'string') {
      throw new Error('Status must be a valid string');
    }

    const requestBody = { status: status.trim() };
    
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      const error = new Error('Server returned non-JSON response. Please check if the backend is running.');
      error.response = { 
        status: response.status,
        data: { message: 'Server error - invalid response format' } 
      };
      throw error;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update user status');
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
      const wrappedError = new Error('Server connection error. Please ensure the backend server is running.');
      wrappedError.response = { status: 500, data: { message: wrappedError.message } };
      throw wrappedError;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { status: 0, data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get all users with optional filters (for admin)
 * @param {Object} filters - Optional filters { status, role }
 * @returns {Promise} Response with users array
 */
export const getAllUsers = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.role) queryParams.append('role', filters.role);

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/admin/users${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch users');
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get current user profile (any role)
 * @returns {Promise<{ success: boolean, user: Object }>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch profile');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Delete current user account and all related data (Donor, Receiver, Driver only).
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteAccount = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to delete account');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Upload profile picture (any role). Sends image as multipart field "avatar".
 * @param {File} file - Image file
 * @returns {Promise<{ success: boolean, user: Object }>}
 */
export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/api/users/me/avatar`, {
      method: 'PATCH',
      headers,
      body: formData,
    });
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: response.statusText || 'Failed to update profile picture' };
    }
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update profile picture');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Update donor profile (businessName, businessType, email, contactNo, address, username)
 * @param {Object} profile - Donor profile fields to update
 * @returns {Promise<{ success: boolean, user: Object }>}
 */
export const updateDonorProfile = async (profile) => {
  try {
    const body = {};
    if (profile.businessName !== undefined) body.businessName = profile.businessName;
    if (profile.businessType !== undefined) body.businessType = profile.businessType;
    if (profile.email !== undefined) body.email = profile.email;
    if (profile.contactNo !== undefined) body.contactNo = profile.contactNo;
    if (profile.address !== undefined) body.address = profile.address;
    if (profile.username !== undefined) body.username = profile.username;

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update profile');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Update receiver profile (receiverName, receiverType, email, contactNo, address)
 * @param {Object} profile - Receiver profile fields to update
 * @returns {Promise<{ success: boolean, user: Object }>}
 */
export const updateReceiverProfile = async (profile) => {
  try {
    const body = {};
    if (profile.receiverName !== undefined) body.receiverName = profile.receiverName;
    if (profile.receiverType !== undefined) body.receiverType = profile.receiverType;
    if (profile.email !== undefined) body.email = profile.email;
    if (profile.contactNo !== undefined) body.contactNo = profile.contactNo;
    if (profile.address !== undefined) body.address = profile.address;

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update profile');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Update driver's current location
 * @param {number} latitude - Driver's latitude
 * @param {number} longitude - Driver's longitude
 * @returns {Promise} Response with updated location
 */
export const updateDriverLocation = async (latitude, longitude) => {
  try {
    console.log('[API] Updating driver location:', { latitude, longitude });
    
    const response = await fetch(`${API_URL}/api/users/me/location`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ latitude, longitude }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update location');
      error.response = { data };
      throw error;
    }

    console.log('[API] Driver location updated successfully');
    return data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Start server-side demo so movement continues after driver signs out.
 * @param {Array<{ latitude: number, longitude: number }>} waypoints
 * @returns {Promise}
 */
export const startDemo = async (waypoints) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me/demo/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ waypoints }),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to start demo');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Stop server-side demo for this driver.
 * @returns {Promise}
 */
export const stopDemo = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/me/demo/stop`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to stop demo');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Update driver profile (driverName, contactNo, address, email, vehicleNumber, vehicleType)
 * @param {Object} profile
 * @returns {Promise<{ success: boolean, user: Object }>}
 */
export const updateDriverProfile = async (profile) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to update profile');
      error.response = { data };
      throw error;
    }
    return data;
  } catch (error) {
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};