import { getAuthHeaders } from '../utils/auth';

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

    if (!response.ok) {
      // Extract user-friendly error message
      let errorMessage = data.message || 'Failed to analyze image';
      
      // For non-food item errors, use a simple message
      if (data.message && (data.message.includes('not related to food') || 
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
export const submitDonation = async (donationData) => {
  try {
    console.log('[DonationAPI] Submitting donation:', donationData);
    
    const headers = getAuthHeaders();
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_URL}/api/donations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(donationData),
    });

    const data = await response.json();

    if (!response.ok) {
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
