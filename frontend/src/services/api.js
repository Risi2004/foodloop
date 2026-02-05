import { getAuthHeaders } from '../utils/auth';

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