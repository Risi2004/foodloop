/**
 * Review API Service
 * Handles all review-related API calls
 */

import { getAuthHeaders, isTokenExpired, clearAuth } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Submit a review
 * @param {string} reviewText - Review text content
 * @returns {Promise} Response with created review
 */
export const submitReview = async (reviewText) => {
  try {
    console.log('[ReviewAPI] Submitting review...');
    
    if (isTokenExpired()) {
      console.warn('[ReviewAPI] Token is expired, clearing auth');
      clearAuth();
      const error = new Error('Your session has expired. Please log in again.');
      error.response = { 
        data: { 
          message: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED'
        } 
      };
      throw error;
    }
    
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}/api/reviews/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reviewText }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[ReviewAPI] Token expired or invalid, clearing auth');
        clearAuth();
        const error = new Error('Your session has expired. Please log in again.');
        error.response = { 
          data: { 
            message: 'Your session has expired. Please log in again.',
            code: 'TOKEN_EXPIRED'
          } 
        };
        throw error;
      }
      
      const error = new Error(data.message || 'Failed to submit review');
      error.response = { data };
      throw error;
    }

    console.log('[ReviewAPI] Review submitted successfully');
    return data;
  } catch (error) {
    console.error('[ReviewAPI] Error submitting review:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get all approved reviews (public)
 * @returns {Promise} Response with approved reviews array
 */
export const getApprovedReviews = async () => {
  try {
    console.log('[ReviewAPI] Fetching approved reviews...');

    const response = await fetch(`${API_URL}/api/reviews/approved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch reviews');
      error.response = { data };
      throw error;
    }

    console.log(`[ReviewAPI] Successfully fetched ${data.count || 0} approved reviews`);
    return data;
  } catch (error) {
    console.error('[ReviewAPI] Error fetching approved reviews:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get pending reviews (Admin only)
 * @returns {Promise} Response with pending reviews array
 */
export const getPendingReviews = async () => {
  try {
    console.log('[ReviewAPI] Fetching pending reviews...');
    
    if (isTokenExpired()) {
      console.warn('[ReviewAPI] Token is expired, clearing auth');
      clearAuth();
      const error = new Error('Your session has expired. Please log in again.');
      error.response = { 
        data: { 
          message: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED'
        } 
      };
      throw error;
    }
    
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}/api/reviews/pending`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[ReviewAPI] Token expired or invalid, clearing auth');
        clearAuth();
        const error = new Error('Your session has expired. Please log in again.');
        error.response = { 
          data: { 
            message: 'Your session has expired. Please log in again.',
            code: 'TOKEN_EXPIRED'
          } 
        };
        throw error;
      }
      
      const error = new Error(data.message || 'Failed to fetch pending reviews');
      error.response = { data };
      throw error;
    }

    console.log(`[ReviewAPI] Successfully fetched ${data.count || 0} pending reviews`);
    return data;
  } catch (error) {
    console.error('[ReviewAPI] Error fetching pending reviews:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Approve a review (Admin only)
 * @param {string} reviewId - Review ID to approve
 * @returns {Promise} Response
 */
export const approveReview = async (reviewId) => {
  try {
    console.log('[ReviewAPI] Approving review:', reviewId);
    
    if (isTokenExpired()) {
      console.warn('[ReviewAPI] Token is expired, clearing auth');
      clearAuth();
      const error = new Error('Your session has expired. Please log in again.');
      error.response = { 
        data: { 
          message: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED'
        } 
      };
      throw error;
    }
    
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/approve`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[ReviewAPI] Token expired or invalid, clearing auth');
        clearAuth();
        const error = new Error('Your session has expired. Please log in again.');
        error.response = { 
          data: { 
            message: 'Your session has expired. Please log in again.',
            code: 'TOKEN_EXPIRED'
          } 
        };
        throw error;
      }
      
      const error = new Error(data.message || 'Failed to approve review');
      error.response = { data };
      throw error;
    }

    console.log('[ReviewAPI] Review approved successfully');
    return data;
  } catch (error) {
    console.error('[ReviewAPI] Error approving review:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Reject a review (Admin only)
 * @param {string} reviewId - Review ID to reject
 * @param {string} reason - Rejection reason
 * @returns {Promise} Response
 */
export const rejectReview = async (reviewId, reason) => {
  try {
    console.log('[ReviewAPI] Rejecting review:', reviewId);
    
    if (isTokenExpired()) {
      console.warn('[ReviewAPI] Token is expired, clearing auth');
      clearAuth();
      const error = new Error('Your session has expired. Please log in again.');
      error.response = { 
        data: { 
          message: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED'
        } 
      };
      throw error;
    }
    
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/reject`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[ReviewAPI] Token expired or invalid, clearing auth');
        clearAuth();
        const error = new Error('Your session has expired. Please log in again.');
        error.response = { 
          data: { 
            message: 'Your session has expired. Please log in again.',
            code: 'TOKEN_EXPIRED'
          } 
        };
        throw error;
      }
      
      const error = new Error(data.message || 'Failed to reject review');
      error.response = { data };
      throw error;
    }

    console.log('[ReviewAPI] Review rejected successfully');
    return data;
  } catch (error) {
    console.error('[ReviewAPI] Error rejecting review:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};
