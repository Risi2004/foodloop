import { getAuthHeaders, isTokenExpired, clearAuth } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Upload donation image to S3
 * @param {File} file - Image file to upload
 * @returns {Promise} Response with imageUrl
 */
export const uploadDonationImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/donations/upload-image`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to upload image');
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { errors: [{ field: 'image', message: wrappedError.message }] } };
    throw wrappedError;
  }
};

/**
 * Analyze food image using AI service
 * @param {string} imageUrl - URL of the uploaded image
 * @returns {Promise} Response with AI predictions
 */
export const analyzeFoodImage = async (imageUrl) => {
  try {
    const response = await fetch(`${API_URL}/api/donations/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    // Check if response is successful (even if predictions are null)
    if (response.ok && data.success) {
      // Success - return data even if predictions are null (AI unavailable but image uploaded)
      return data;
    }

    if (!response.ok) {
      // Extract user-friendly error message
      let errorMessage = data.message || 'Failed to analyze image';
      
      // For AI-generated image errors, use a simple message
      if (data.message && (data.message.includes('AI-generated') || 
                           data.message.includes('ai-generated') ||
                           data.message.includes('synthetic') ||
                           data.message.includes('real photo'))) {
        errorMessage = 'AI-generated images are not allowed. Please upload a real photo of food.';
      }
      // For non-food item errors, use a simple message
      else if (data.message && (data.message.includes('not related to food') || 
                                 data.message.includes('does not contain food'))) {
        errorMessage = 'This image is not related to food items. Please upload an image of food only.';
      }
      
      const error = new Error(errorMessage);
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
 * Upload and analyze image in one call
 * @param {File} file - Image file to upload and analyze
 * @returns {Promise} Response with imageUrl and predictions
 */
export const uploadAndAnalyzeImage = async (file) => {
  try {
    console.log('[DonationAPI] Starting upload and analyze for file:', file.name);
    
    // First upload the image
    console.log('[DonationAPI] Step 1: Uploading image to S3...');
    const uploadResponse = await uploadDonationImage(file);
    const imageUrl = uploadResponse.imageUrl;
    console.log('[DonationAPI] Image uploaded successfully:', imageUrl);

    // Then analyze it
    console.log('[DonationAPI] Step 2: Analyzing image with AI service...');
    const analysisResponse = await analyzeFoodImage(imageUrl);
    console.log('[DonationAPI] Analysis response received:', analysisResponse);

    // Validate predictions structure
    if (!analysisResponse || !analysisResponse.predictions) {
      console.warn('[DonationAPI] No predictions in analysis response');
      throw new Error('AI analysis completed but no predictions were returned');
    }

    const result = {
      imageUrl: imageUrl,
      predictions: analysisResponse.predictions,
    };

    console.log('[DonationAPI] Returning result:', {
      imageUrl: result.imageUrl,
      hasPredictions: !!result.predictions,
      predictionsKeys: result.predictions ? Object.keys(result.predictions) : []
    });

    return result;
  } catch (error) {
    console.error('[DonationAPI] Error in uploadAndAnalyzeImage:', error);
    console.error('[DonationAPI] Error details:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

/**
 * Submit donation to backend
 * @param {Object} donationData - Donation data to submit
 * @returns {Promise} Response with created donation
 */
/**
 * Get all available donations for receivers
 * @returns {Promise} Response with available donations array
 */
export const getAvailableDonations = async () => {
  try {
    console.log('[DonationAPI] Fetching available donations...');
    
    const response = await fetch(`${API_URL}/api/donations/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch available donations');
      error.response = { data };
      throw error;
    }

    console.log(`[DonationAPI] Successfully fetched ${data.count || 0} donations`);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching available donations:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Claim a donation (receiver claims a food donation)
 * @param {string} donationId - Donation ID to claim
 * @returns {Promise} Response with claimed donation
 */
export const claimDonation = async (donationId) => {
  try {
    console.log('[DonationAPI] Claiming donation:', donationId);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/${donationId}/claim`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to claim donation');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Donation claimed successfully:', data);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error claiming donation:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get donor's donations
 * @returns {Promise} Response with donations array
 */
export const getMyDonations = async () => {
  try {
    console.log('[DonationAPI] Fetching my donations...');
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/my-donations`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch my donations');
      error.response = { data };
      throw error;
    }

    console.log(`[DonationAPI] Successfully fetched ${data.count || 0} donations`);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching my donations:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get receiver's claimed donations
 * @returns {Promise} Response with claimed donations array
 */
export const getMyClaims = async () => {
  try {
    console.log('[DonationAPI] Fetching my claims...');
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/my-claims`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch my claims');
      error.response = { data };
      throw error;
    }

    console.log(`[DonationAPI] Successfully fetched ${data.count || 0} claimed donations`);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching my claims:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get available pickups for drivers
 * @returns {Promise} Response with available pickups array
 */
export const getAvailablePickups = async () => {
  try {
    console.log('[DonationAPI] Fetching available pickups...');
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/available-pickups`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch available pickups');
      error.response = { data };
      throw error;
    }

    console.log(`[DonationAPI] Successfully fetched ${data.count || 0} available pickups`);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching available pickups:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Accept order: driver claims an order from Available Pickups (before physical pickup).
 * Order appears in My Pickups In Transit. Use confirmPickup when physically at donor.
 * @param {string} donationId - Donation ID to accept
 * @returns {Promise} Response with accepted donation
 */
export const acceptOrder = async (donationId) => {
  try {
    console.log('[DonationAPI] Accepting order for donation:', donationId);
    if (isTokenExpired()) {
      clearAuth();
      const error = new Error('Your session has expired. Please log in again.');
      error.response = { data: { message: 'Your session has expired. Please log in again.', code: 'TOKEN_EXPIRED' } };
      throw error;
    }
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';
    const response = await fetch(`${API_URL}/api/donations/${donationId}/accept-order`, {
      method: 'POST',
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        clearAuth();
        const error = new Error('Your session has expired. Please log in again.');
        error.response = { data: { message: 'Your session has expired. Please log in again.', code: 'TOKEN_EXPIRED' } };
        throw error;
      }
      const error = new Error(data.message || 'Failed to accept order');
      error.response = { data };
      throw error;
    }
    console.log('[DonationAPI] Order accepted:', data);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error accepting order:', error);
    if (error.response) throw error;
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Confirm pickup of a donation (driver confirms physical pickup at donor)
 * @param {string} donationId - Donation ID to confirm pickup for
 * @returns {Promise} Response with confirmed donation
 */
export const confirmPickup = async (donationId) => {
  try {
    console.log('[DonationAPI] Confirming pickup for donation:', donationId);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/${donationId}/confirm-pickup`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to confirm pickup');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Pickup confirmed successfully:', data);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error confirming pickup:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get active deliveries for driver (status: 'picked_up')
 * @returns {Promise} Response with active deliveries array
 */
export const getActiveDeliveries = async () => {
  try {
    console.log('[DonationAPI] Fetching active deliveries...');
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/active-deliveries`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch active deliveries');
      error.response = { data };
      throw error;
    }

    console.log(`[DonationAPI] Successfully fetched ${data.count || 0} active deliveries`);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching active deliveries:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get driver statistics (deliveries completed, distance travelled, etc.)
 * @returns {Promise} Response with driver statistics
 */
export const getDriverStatistics = async () => {
  try {
    console.log('[DonationAPI] Fetching driver statistics...');
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/driver-statistics`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch driver statistics');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Driver statistics fetched successfully');
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching driver statistics:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get completed deliveries for driver
 * @returns {Promise} Response with completed deliveries array
 */
export const getDriverCompletedDeliveries = async () => {
  try {
    console.log('[DonationAPI] Fetching driver completed deliveries...');
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/driver-completed`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch completed deliveries');
      error.response = { data };
      throw error;
    }

    console.log(`[DonationAPI] Successfully fetched ${data.count || 0} completed deliveries`);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching completed deliveries:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

const TRACKING_FETCH_TIMEOUT_MS = 15000;

/**
 * Get tracking data for a donation
 * @param {string} donationId - Donation ID to track
 * @returns {Promise} Response with tracking data
 */
export const getDonationTracking = async (donationId) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRACKING_FETCH_TIMEOUT_MS);

  try {
    console.log('[DonationAPI] Fetching tracking data for donation:', donationId);

    const response = await fetch(`${API_URL}/api/donations/${donationId}/tracking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch tracking data');
      error.response = { data };
      throw error;
    }

    if (!data.tracking) {
      const error = new Error('Invalid tracking response');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Tracking data fetched successfully');
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[DonationAPI] Error fetching tracking data:', error);
    if (error.name === 'AbortError') {
      const wrappedError = new Error('Request timed out. Please check your connection and try again.');
      wrappedError.response = { data: { message: wrappedError.message } };
      throw wrappedError;
    }
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Confirm delivery of a donation
 * @param {string} donationId - Donation ID to confirm delivery for
 * @returns {Promise} Response with confirmed donation
 */
export const confirmDelivery = async (donationId) => {
  try {
    console.log('[DonationAPI] Confirming delivery for donation:', donationId);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/${donationId}/confirm-delivery`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to confirm delivery');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Delivery confirmed successfully:', data);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error confirming delivery:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

export const submitDonation = async (donationData) => {
  try {
    console.log('[DonationAPI] Submitting donation:', donationData);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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
    
    // Include donor coordinates if provided
    const requestBody = {
      ...donationData,
      ...(donationData.donorLatitude && donationData.donorLongitude && {
        donorLatitude: donationData.donorLatitude,
        donorLongitude: donationData.donorLongitude,
      }),
    };
    
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}/api/donations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to submit donation');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Donation submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error submitting donation:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get donation details for receipt creation
 * @param {string} donationId - Donation ID to get receipt details for
 * @returns {Promise} Response with receipt details
 */
export const getDonationReceiptDetails = async (donationId) => {
  try {
    console.log('[DonationAPI] Fetching receipt details for donation:', donationId);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/${donationId}/receipt-details`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(data.message || 'Failed to fetch receipt details');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Receipt details fetched successfully');
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error fetching receipt details:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Create an impact receipt for a donation
 * @param {string} donationId - Donation ID to create receipt for
 * @param {Object} receiptData - Receipt data (dropLocation, peopleFed, methaneSaved)
 * @returns {Promise} Response with created receipt
 */
export const createImpactReceipt = async (donationId, receiptData) => {
  try {
    console.log('[DonationAPI] Creating impact receipt for donation:', donationId);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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

    const response = await fetch(`${API_URL}/api/donations/${donationId}/create-receipt`, {
      method: 'POST',
      headers,
      body: JSON.stringify(receiptData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration error
      if (response.status === 401 && (data.message?.includes('token') || data.message?.includes('expired') || data.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        const error = new Error(data.message || 'Validation error');
        error.response = { data };
        throw error;
      }
      
      const error = new Error(data.message || 'Failed to create impact receipt');
      error.response = { data };
      throw error;
    }

    console.log('[DonationAPI] Impact receipt created successfully');
    return data;
  } catch (error) {
    console.error('[DonationAPI] Error creating impact receipt:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};

/**
 * Get PDF receipt for a donation
 * @param {string} donationId - Donation ID to get PDF receipt for
 * @returns {Promise<Blob>} PDF blob
 */
export const getReceiptPDF = async (donationId) => {
  try {
    console.log('[DonationAPI] Fetching PDF receipt for donation:', donationId);
    
    // Check if token is expired before making the request
    if (isTokenExpired()) {
      console.warn('[DonationAPI] Token is expired, clearing auth');
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
    // Don't set Content-Type for blob response

    const response = await fetch(`${API_URL}/api/donations/${donationId}/receipt-pdf`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch PDF' }));
      
      // Handle token expiration error
      if (response.status === 401 && (errorData.message?.includes('token') || errorData.message?.includes('expired') || errorData.message?.includes('Invalid'))) {
        console.warn('[DonationAPI] Token expired or invalid, clearing auth');
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
      
      const error = new Error(errorData.message || 'Failed to fetch PDF receipt');
      error.response = { data: errorData };
      throw error;
    }

    // Get PDF as blob
    const blob = await response.blob();
    console.log('[DonationAPI] PDF receipt fetched successfully');
    return blob;
  } catch (error) {
    console.error('[DonationAPI] Error fetching PDF receipt:', error);
    if (error.response) {
      throw error;
    }
    const wrappedError = new Error(error.message || 'Network error occurred');
    wrappedError.response = { data: { message: wrappedError.message } };
    throw wrappedError;
  }
};
