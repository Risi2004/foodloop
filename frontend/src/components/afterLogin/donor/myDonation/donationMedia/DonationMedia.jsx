import { useState, useRef } from 'react';
import { uploadAndAnalyzeImage } from '../../../../../services/donationApi';
import './DonationMedia.css';

function DonationMedia({ onImageUploaded, onAnalysisComplete, onError }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Handle file selection from gallery
    const handleGalleryClick = () => {
        fileInputRef.current?.click();
    };

    // Handle camera capture
    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    // Handle file selection (both gallery and camera)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                return;
            }

            setSelectedImage(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload and analyze image
            await uploadAndAnalyzeImageFile(file);
        }

        // Reset input so same file can be selected again
        e.target.value = '';
    };

    // Upload and analyze image
    const uploadAndAnalyzeImageFile = async (file) => {
        try {
            setUploading(true);
            setAnalyzing(true);
            console.log('[DonationMedia] Starting upload and analysis for file:', file.name);

            // Upload and analyze
            const result = await uploadAndAnalyzeImage(file);
            console.log('[DonationMedia] Upload and analysis complete:', {
                imageUrl: result.imageUrl,
                hasPredictions: !!result.predictions,
                predictions: result.predictions
            });
            
            setImageUrl(result.imageUrl);
            setUploading(false);

            // Notify parent components
            if (onImageUploaded) {
                onImageUploaded(result.imageUrl);
            }

            // Always pass predictions if they exist, even if incomplete
            if (onAnalysisComplete) {
                if (result.predictions) {
                    console.log('[DonationMedia] Passing predictions to form:', result.predictions);
                    onAnalysisComplete(result.predictions);
                } else {
                    console.warn('[DonationMedia] No predictions in result, but analysis completed');
                    // Still notify that analysis is complete (even if empty)
                    onAnalysisComplete(null);
                }
            }

            setAnalyzing(false);
        } catch (error) {
            // Only log errors in development, not show to users
            if (process.env.NODE_ENV === 'development') {
                console.error('[DonationMedia] Error uploading/analyzing image:', error);
            }
            
            setUploading(false);
            setAnalyzing(false);
            
            // Extract error message
            let errorMessage = 'Failed to upload or analyze image';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors && error.response.data.errors.length > 0) {
                // Use the first error message from the errors array
                errorMessage = error.response.data.errors[0].message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Check if it's a validation error (non-food items)
            const isValidationError = errorMessage.includes('not related to food') || 
                                     errorMessage.includes('does not contain food') || 
                                     errorMessage.includes('Non-food items') || 
                                     errorMessage.includes('No food items') ||
                                     errorMessage.includes('must contain food') ||
                                     errorMessage.includes('non-food');
            
            // Show user-friendly error message
            if (onError) {
                if (isValidationError) {
                    // Simple, clear message for non-food items
                    onError('⚠️ This image is not related to food items. Please upload an image of food only.');
                } else {
                    onError(errorMessage);
                }
            } else {
                if (isValidationError) {
                    alert('⚠️ This image is not related to food items. Please upload an image of food only.');
                } else {
                    alert(`Error: ${errorMessage}. You can still fill the form manually.`);
                }
            }
        }
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size should be less than 10MB');
                return;
            }

            setSelectedImage(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload and analyze dropped image
            uploadAndAnalyzeImageFile(file);
        } else {
            alert('Please drop an image file');
        }
    };

    // Remove selected image
    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setSelectedImage(null);
        setImagePreview(null);
        setImageUrl(null);
        setUploading(false);
        setAnalyzing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
        
        // Notify parent
        if (onImageUploaded) onImageUploaded(null);
        if (onAnalysisComplete) onAnalysisComplete(null);
    };

    return (
        <div className="donation-media-section">
            <div className="mobile-frame">
                <div className="mobile-screen">
                    <div 
                        className="camera-view"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={{
                            backgroundImage: imagePreview 
                                ? `url(${imagePreview})` 
                                : `url('https://images.unsplash.com/photo-1595855709940-fae372671549?q=80&w=2670&auto=format&fit=crop')`
                        }}
                    >
                        {!imagePreview && (
                            <div className="upload-zone" onClick={handleGalleryClick}>
                                <span className="upload-icon">📷</span>
                                <p>Drag and Drop</p>
                            </div>
                        )}
                        {imagePreview && (
                            <div className="image-preview-overlay">
                                {(uploading || analyzing) && (
                                    <div className="ai-loading-overlay">
                                        <div className="loading-content">
                                            <div className="loading-spinner">
                                                <div className="spinner-ring"></div>
                                                <div className="spinner-ring"></div>
                                                <div className="spinner-ring"></div>
                                            </div>
                                            <div className="loading-text">
                                                {uploading && (
                                                    <>
                                                        <h3>Uploading Image...</h3>
                                                        <p>Please wait while we upload your image</p>
                                                    </>
                                                )}
                                                {analyzing && !uploading && (
                                                    <>
                                                        <h3>AI Analyzing Food</h3>
                                                        <p>Detecting food items and assessing quality...</p>
                                                        <div className="loading-dots">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button 
                                    className="remove-image-btn" 
                                    onClick={handleRemoveImage}
                                    title="Remove image"
                                    disabled={uploading || analyzing}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mobile-controls">
                    <button 
                        className="media-btn gallery-btn" 
                        onClick={handleGalleryClick}
                        title="Upload from gallery"
                    >
                        <span className="icon">🖼️</span>
                    </button>
                    <button 
                        className="media-btn camera-btn" 
                        onClick={handleCameraClick}
                        title="Take photo"
                    >
                        <span className="icon">📷</span>
                    </button>
                </div>
            </div>

            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}

export default DonationMedia;
