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
 * Confirm pickup of a donation (driver confirms they will pick up)
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
