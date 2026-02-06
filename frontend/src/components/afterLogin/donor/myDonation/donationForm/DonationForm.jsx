import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDonation, getDonorStatistics } from '../../../../../services/donationApi';
import { clearAuth, getUser } from '../../../../../utils/auth';
import { getBadgeIconSrc, BADGE_KEYS_ORDER } from '../../../../../utils/badgeIcons';
import LocationMapModal from '../locationMapModal/LocationMapModal';
import './DonationForm.css';

function DonationForm({ aiPredictions, imageUrl, error }) {
    const navigate = useNavigate();
    
    // Form state
    const [foodCategory, setFoodCategory] = useState('Cooked Meals');
    const [itemName, setItemName] = useState('Vegetable Curry with Rice');
    const [quantity, setQuantity] = useState(15);
    const [storage, setStorage] = useState('hot'); // hot, cold, dry
    // Pickup date and time
    const [pickupDate, setPickupDate] = useState(() => {
        // Default to today's date in YYYY-MM-DD format
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    // From = current time, To = current time + 1.5 hrs (editable)
    const getTimeString = (d) =>
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const [pickupTimeFrom, setPickupTimeFrom] = useState(() => {
        return getTimeString(new Date());
    });
    const [pickupTimeTo, setPickupTimeTo] = useState(() => {
        const now = new Date();
        const to = new Date(now.getTime() + 90 * 60 * 1000); // +1.5 hours
        return getTimeString(to);
    });
    const [aiConfidence, setAiConfidence] = useState(null);
    const [aiQualityScore, setAiQualityScore] = useState(null);
    const [isAiFilled, setIsAiFilled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [safetyConfirmed, setSafetyConfirmed] = useState(false);
    const [userProvidedExpiryDate, setUserProvidedExpiryDate] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [selectedLatitude, setSelectedLatitude] = useState(null);
    const [selectedLongitude, setSelectedLongitude] = useState(null);
    const [donorAddress, setDonorAddress] = useState('');
    const [donorStats, setDonorStats] = useState(null);

    useEffect(() => {
        const fetchBadge = async () => {
            try {
                const res = await getDonorStatistics();
                if (res?.success && res?.statistics) {
                    setDonorStats(res.statistics);
                }
            } catch (_) {
                setDonorStats(null);
            }
        };
        fetchBadge();
    }, []);

    // Validation: Check if form is valid and can be submitted
    const isFormValid = () => {
        // Check all required fields
        const hasImage = !!imageUrl;
        const hasFoodCategory = !!foodCategory && foodCategory.trim() !== '';
        const hasItemName = !!itemName && itemName.trim() !== '';
        const hasQuantity = quantity > 0;
        const hasStorage = !!storage;
        const hasPickupDate = !!pickupDate;
        const hasPickupTimeFrom = !!pickupTimeFrom;
        const hasPickupTimeTo = !!pickupTimeTo;
        const hasSafetyConfirm = safetyConfirmed;
        
        // Validate time range (From should be before To)
        const isTimeRangeValid = hasPickupTimeFrom && hasPickupTimeTo && pickupTimeFrom < pickupTimeTo;
        
        // Check quality score (must be >= 80% or 0.8)
        const qualityScore = aiQualityScore || aiPredictions?.qualityScore;
        const hasValidQuality = qualityScore === null || qualityScore === undefined || qualityScore >= 0.8;
        
        // Check if expiry date is provided (required for all products)
        const hasExpiryDate = !!userProvidedExpiryDate;
        
        return hasImage && hasFoodCategory && hasItemName && hasQuantity && 
               hasStorage && hasPickupDate && hasPickupTimeFrom && hasPickupTimeTo && 
               isTimeRangeValid && hasSafetyConfirm && hasValidQuality && hasExpiryDate;
    };
    
    // Get reason why button is disabled
    const getDisabledReason = () => {
        const reasons = [];
        
        if (!imageUrl) reasons.push('Please upload an image');
        if (!foodCategory || foodCategory.trim() === '') reasons.push('Food category is required');
        if (!itemName || itemName.trim() === '') reasons.push('Item name is required');
        if (quantity <= 0) reasons.push('Quantity must be greater than 0');
        if (!storage) reasons.push('Storage instruction is required');
        if (!pickupDate) reasons.push('Pickup date is required');
        if (!pickupTimeFrom) reasons.push('Pickup start time is required');
        if (!pickupTimeTo) reasons.push('Pickup end time is required');
        if (pickupTimeFrom && pickupTimeTo && pickupTimeFrom >= pickupTimeTo) {
            reasons.push('End time must be after start time');
        }
        
        // Check expiry date (required for all products)
        if (!userProvidedExpiryDate) {
            reasons.push('Expiry date is required');
        }
        
        if (!safetyConfirmed) reasons.push('Please confirm safety standards');
        
        const qualityScore = aiQualityScore || aiPredictions?.qualityScore;
        if (qualityScore !== null && qualityScore !== undefined && qualityScore < 0.8) {
            const qualityPercent = Math.round(qualityScore * 100);
            reasons.push(`Food quality score is ${qualityPercent}% (minimum 80% required)`);
        }
        
        return reasons.length > 0 ? reasons.join(', ') : null;
    };

    // Auto-fill form when AI predictions are received
    useEffect(() => {
        console.log('[DonationForm] aiPredictions changed:', aiPredictions);
        console.log('[DonationForm] isEditing:', isEditing);
        
        if (aiPredictions && !isEditing) {
            console.log('[DonationForm] Filling form with AI predictions:', aiPredictions);
            
            // Update form fields with AI predictions
            if (aiPredictions.foodCategory) {
                console.log('[DonationForm] Setting foodCategory:', aiPredictions.foodCategory);
                setFoodCategory(aiPredictions.foodCategory);
            }
            if (aiPredictions.itemName) {
                console.log('[DonationForm] Setting itemName:', aiPredictions.itemName);
                setItemName(aiPredictions.itemName);
            }
            if (aiPredictions.quantity) {
                console.log('[DonationForm] Setting quantity:', aiPredictions.quantity);
                setQuantity(aiPredictions.quantity);
            }
            if (aiPredictions.storageRecommendation) {
                const storageLower = aiPredictions.storageRecommendation.toLowerCase();
                console.log('[DonationForm] Setting storage:', storageLower);
                if (storageLower === 'hot' || storageLower === 'cold' || storageLower === 'dry') {
                    setStorage(storageLower);
                } else {
                    console.warn('[DonationForm] Invalid storage recommendation:', aiPredictions.storageRecommendation);
                }
            }
            if (aiPredictions.confidence) {
                console.log('[DonationForm] Setting confidence:', aiPredictions.confidence);
                setAiConfidence(aiPredictions.confidence);
            }
            if (aiPredictions.qualityScore) {
                console.log('[DonationForm] Setting qualityScore:', aiPredictions.qualityScore);
                setAiQualityScore(aiPredictions.qualityScore);
            }
            
            // Auto-calculate and set expiry date based on product type
            if (!userProvidedExpiryDate) {
                const productType = aiPredictions.productType || 'cooked';
                
                if (productType === 'packed' && aiPredictions.expiryDateFromPackage) {
                    // For packed products: use AI-detected expiry date from package
                    try {
                        const expiryDate = new Date(aiPredictions.expiryDateFromPackage);
                        const formattedDate = expiryDate.toISOString().split('T')[0];
                        setUserProvidedExpiryDate(formattedDate);
                        console.log('[DonationForm] Auto-filled expiry date from AI (packed product):', formattedDate);
                    } catch (error) {
                        console.error('[DonationForm] Error formatting expiry date from package:', error);
                    }
                } else if (productType === 'cooked') {
                    // For cooked products: calculate 2 days from today
                    const today = new Date();
                    const expiryDate = new Date(today);
                    expiryDate.setDate(expiryDate.getDate() + 2); // Add 2 days
                    const formattedDate = expiryDate.toISOString().split('T')[0];
                    setUserProvidedExpiryDate(formattedDate);
                    console.log('[DonationForm] Auto-calculated expiry date for cooked product (2 days):', formattedDate);
                } else {
                    // For other product types or if no product type detected: default to 3 days
                    const today = new Date();
                    const expiryDate = new Date(today);
                    expiryDate.setDate(expiryDate.getDate() + 3); // Add 3 days as default
                    const formattedDate = expiryDate.toISOString().split('T')[0];
                    setUserProvidedExpiryDate(formattedDate);
                    console.log('[DonationForm] Auto-calculated expiry date (default 3 days):', formattedDate);
                }
            }
            
            setIsAiFilled(true);
            console.log('[DonationForm] Form filled successfully with AI predictions');
        } else if (aiPredictions && isEditing) {
            console.log('[DonationForm] Predictions received but form is in editing mode, skipping auto-fill');
        } else if (!aiPredictions) {
            console.log('[DonationForm] No predictions available yet');
        }
    }, [aiPredictions, isEditing]);

    // Handle quantity increment/decrement
    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    // Get donor address on component mount
    useEffect(() => {
        const user = getUser();
        if (user && user.address) {
            setDonorAddress(user.address);
        }
    }, []);

    // Handle edit all fields
    const handleEditAll = () => {
        setIsEditing(!isEditing);
    };

    const handlePostDonation = async () => {
        // Validate required fields
        if (!imageUrl) {
            setSubmitError('Please upload an image first');
            return;
        }

        if (!itemName || !foodCategory || !quantity) {
            setSubmitError('Please fill in all required fields');
            return;
        }

        // Get donor address if not already set
        if (!donorAddress) {
            const user = getUser();
            if (user && user.address) {
                setDonorAddress(user.address);
            }
        }

        // Open location confirmation modal
        setShowLocationModal(true);
    };

    // Handle location confirmation from modal
    const handleLocationConfirm = async (lat, lng, address) => {
        setShowLocationModal(false);
        setSelectedLatitude(lat);
        setSelectedLongitude(lng);

        // Now submit the donation with coordinates
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Capitalize storage recommendation (Hot, Cold, Dry)
            const storageCapitalized = storage.charAt(0).toUpperCase() + storage.slice(1);

            const donationData = {
                foodCategory,
                itemName,
                quantity: Number(quantity),
                storageRecommendation: storageCapitalized,
                imageUrl,
                preferredPickupDate: pickupDate, // ISO date string
                preferredPickupTimeFrom: pickupTimeFrom,
                preferredPickupTimeTo: pickupTimeTo,
                aiConfidence: aiConfidence || aiPredictions?.confidence || null,
                aiQualityScore: aiPredictions?.qualityScore || null,
                aiFreshness: aiPredictions?.freshness || null,
                aiDetectedItems: aiPredictions?.detectedItems || [],
                // Product type and expiry from AI
                productType: aiPredictions?.productType || null,
                expiryDateFromPackage: aiPredictions?.expiryDateFromPackage || null,
                // User-provided expiry (always use user input if provided, otherwise use AI-detected)
                userProvidedExpiryDate: userProvidedExpiryDate || aiPredictions?.expiryDateFromPackage || null,
                // Donor-confirmed coordinates
                donorLatitude: lat,
                donorLongitude: lng,
            };

            console.log('[DonationForm] Submitting donation with coordinates:', donationData);

            const response = await submitDonation(donationData);

            if (response.success) {
                console.log('[DonationForm] Donation submitted successfully:', response.donation);
                // Navigate to My Donation page after successful submission
                navigate('/donor/my-donation');
            } else {
                throw new Error(response.message || 'Failed to submit donation');
            }
        } catch (error) {
            console.error('[DonationForm] Error submitting donation:', error);
            console.error('[DonationForm] Error response:', error.response?.data);
            
            // Handle token expiration - redirect to login
            if (error.response?.data?.code === 'TOKEN_EXPIRED' || 
                error.response?.data?.message?.includes('expired') ||
                error.response?.data?.message?.includes('session')) {
                clearAuth();
                alert('Your session has expired. Please log in again to continue.');
                navigate('/login');
                return;
            }
            
            // Extract detailed error message
            let errorMessage = 'Failed to submit donation. Please try again.';
            
            if (error.response?.data) {
                // Check for validation errors array
                if (error.response.data.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
                    errorMessage = error.response.data.errors.map(err => err.message || `${err.field}: ${err.message}`).join(', ');
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle modal close
    const handleLocationModalClose = () => {
        setShowLocationModal(false);
    };

    return (
        <div className="donation-form-container">
            {/* AI Analysis Banner */}
            {aiPredictions && (
                <div className="ai-analysis-banner">
                    <div className="analysis-status">
                        <span className="check-icon-circle">✓</span>
                        <span className="analysis-text">
                            AI Analysis: <span className="confidence">{Math.round((aiConfidence || aiPredictions.confidence || 0.90) * 100)}% confidence</span> — <span className="quality">{Math.round((aiQualityScore || aiPredictions.qualityScore || 0.85) * 100)}% quality</span> — Freshness Verified
                        </span>
                    </div>
                    <div className="safety-badge">⚡ High Safety</div>
                </div>
            )}
            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                </div>
            )}
            {submitError && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{submitError}</span>
                </div>
            )}

            {/* Core Details Header */}
            <div className="form-section-header">
                <div className="section-title">
                    <span className="magic-wand-icon">🪄</span>
                    <h2>Core Details</h2>
                    {isAiFilled && <span className="ai-filled-badge">(AI-Filled)</span>}
                </div>
                <button className="edit-all-btn" onClick={handleEditAll}>
                    {isEditing ? 'Done Editing' : 'Edit All Fields'}
                </button>
            </div>

            {/* Core Details Form */}
            <div className="form-grid">
                <div className="form-group">
                    <label>Food Category <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            value={foodCategory}
                            onChange={(e) => {
                                setFoodCategory(e.target.value);
                                setIsEditing(true);
                            }}
                            readOnly={!isEditing && isAiFilled}
                            required
                        />
                        {(!isEditing || !isAiFilled) && <span className="edit-icon">📝</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Item Name <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            value={itemName}
                            onChange={(e) => {
                                setItemName(e.target.value);
                                setIsEditing(true);
                            }}
                            readOnly={!isEditing && isAiFilled}
                            required
                        />
                        {(!isEditing || !isAiFilled) && <span className="edit-icon">📝</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Quantity / Servings <span className="required-asterisk">*</span></label>
                    <div className="quantity-control">
                        <button 
                            className="qty-btn minus" 
                            onClick={() => handleQuantityChange(-1)}
                            disabled={!isEditing && isAiFilled}
                        >
                            —
                        </button>
                        <input 
                            type="text" 
                            value={isEditing ? quantity : `${quantity} Plates`}
                            className="qty-input"
                            readOnly={!isEditing && isAiFilled}
                            onChange={(e) => {
                                const text = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                const value = parseInt(text) || 1;
                                setQuantity(value);
                                setIsEditing(true);
                            }}
                            onFocus={(e) => {
                                if (!isEditing && isAiFilled) {
                                    e.target.blur();
                                } else {
                                    e.target.value = quantity.toString();
                                }
                            }}
                        />
                        <button 
                            className="qty-btn plus" 
                            onClick={() => handleQuantityChange(1)}
                            disabled={!isEditing && isAiFilled}
                        >
                            ＋
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Storage Instructions <span className="required-asterisk">*</span></label>
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn hot ${storage === 'hot' ? 'active' : ''}`}
                            onClick={() => setStorage('hot')}
                        >
                            ☀️ Hot
                        </button>
                        <button
                            className={`toggle-btn cold ${storage === 'cold' ? 'active' : ''}`}
                            onClick={() => setStorage('cold')}
                        >
                            ❄️ Cold
                        </button>
                        <button
                            className={`toggle-btn dry ${storage === 'dry' ? 'active' : ''}`}
                            onClick={() => setStorage('dry')}
                        >
                            💧 Dry
                        </button>
                    </div>
                </div>
            </div>

            {/* Logistics Header */}
            <div className="form-section-header logistics-header">
                <div className="section-title">
                    <span className="truck-icon">🚛</span>
                    <h2>Logistics & Impact</h2>
                </div>
            </div>

            {/* Logistics Content */}
            <div className="logistics-grid">
                <div className="pickup-column">
                    <label>Pickup Window <span className="required-asterisk">*</span></label>
                    <div className="pickup-datetime-container">
                        <div className="pickup-date-wrapper">
                            <div className="pickup-input-group">
                                <span className="pickup-icon">📅</span>
                                <input
                                    type="date"
                                    className="pickup-date-input"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>
                        <div className="pickup-time-wrapper">
                            <div className="pickup-input-group">
                                <span className="pickup-icon">🕒</span>
                                <label className="pickup-time-label">From</label>
                                <input
                                    type="time"
                                    className="pickup-time-input"
                                    value={pickupTimeFrom}
                                    onChange={(e) => setPickupTimeFrom(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="pickup-input-group">
                                <span className="pickup-icon">🕒</span>
                                <label className="pickup-time-label">To</label>
                                <input
                                    type="time"
                                    className="pickup-time-input"
                                    value={pickupTimeTo}
                                    onChange={(e) => setPickupTimeTo(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="impact-column">
                    <div className="impact-card">
                        <label>Impact Estimate</label>
                        <div className="impact-value">
                            <span className="number">{quantity}</span>
                            <span className="unit">people</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expiry Date Input (always visible) */}
            <div className="form-section-header" style={{ marginTop: '20px' }}>
                <div className="section-title">
                    <span className="magic-wand-icon">📅</span>
                    <h2>Expiry Date</h2>
                </div>
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label>Expiry Date <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                        <input
                            type="date"
                            value={userProvidedExpiryDate}
                            onChange={(e) => setUserProvidedExpiryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                        {aiPredictions?.productType === 'packed' 
                            ? 'Enter the expiry date from the package label (or use AI-detected date if available)'
                            : 'Enter the expiry date for this food item'}
                        {aiPredictions?.expiryDateFromPackage && (
                            <span style={{ display: 'block', marginTop: '4px', color: '#10b981' }}>
                                💡 AI detected expiry: {new Date(aiPredictions.expiryDateFromPackage).toLocaleDateString()}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="form-footer">
                <div className="checkbox-group">
                    <input 
                        type="checkbox" 
                        id="safety-confirm" 
                        checked={safetyConfirmed}
                        onChange={(e) => setSafetyConfirmed(e.target.checked)}
                        required
                    />
                    <label htmlFor="safety-confirm">I confirm that all detected AI details are accurate and the food meets safety standards.</label>
                </div>

                <div className="post-button-wrapper">
                    <button 
                        className={`post-donation-btn ${!isFormValid() ? 'disabled' : ''}`}
                        onClick={handlePostDonation}
                        disabled={isSubmitting || !isFormValid()}
                        title={!isFormValid() ? getDisabledReason() : ''}
                    >
                        {isSubmitting ? 'Submitting...' : 'Post Donation ▶'}
                    </button>
                    {!isFormValid() && (
                        <div className="disabled-tooltip">
                            {getDisabledReason()}
                        </div>
                    )}
                </div>

                {donorStats?.badgeProgress && (
                    <div className="progress-status">
                        <div className="progress-text">
                            {(() => {
                                const bp = donorStats.badgeProgress;
                                const nextIndex = bp.timeline?.findIndex((t) => !t.achieved) ?? -1;
                                const nextKey = nextIndex >= 0 ? BADGE_KEYS_ORDER[nextIndex] : null;
                                const iconKey = bp.currentBadgeKey || nextKey;
                                const badgeIconSrc = iconKey ? getBadgeIconSrc(iconKey) : null;
                                return (
                                    <>
                                        {badgeIconSrc && (
                                            <img src={badgeIconSrc} alt="" className="progress-status__badge-icon" />
                                        )}
                                        {bp.nextBadge ? (
                                            bp.remaining === 0 ? (
                                                <>You're one donation away from your <strong>{bp.nextBadge}</strong> badge!</>
                                            ) : bp.remaining === 1 ? (
                                                <>You are 1 donation away from your <strong>{bp.nextBadge}</strong> badge!</>
                                            ) : (
                                                <>You are {bp.remaining} donations away from your <strong>{bp.nextBadge}</strong> badge!</>
                                            )
                                    ) : (
                                        <>You've earned all donation badges! Congratulations!</>
                                    )}
                                    {bp.nextMilestone != null ? (
                                        <span className="progress-fraction">
                                            {donorStats.totalDonationsDelivered ?? 0}/{bp.nextMilestone} Completed
                                        </span>
                                    ) : (
                                        <span className="progress-fraction">
                                            {donorStats.totalDonationsDelivered ?? 0}+ Completed
                                        </span>
                                    )}
                                    </>
                                );
                            })()}
                        </div>
                        {donorStats.badgeProgress.nextMilestone != null && donorStats.badgeProgress.remaining != null && (
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            ((donorStats.badgeProgress.nextMilestone - donorStats.badgeProgress.remaining) / donorStats.badgeProgress.nextMilestone) * 100
                                        )}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Location Confirmation Modal */}
            <LocationMapModal
                isOpen={showLocationModal}
                onClose={handleLocationModalClose}
                onConfirm={handleLocationConfirm}
                defaultAddress={donorAddress}
            />
        </div>
    );
}

export default DonationForm;
