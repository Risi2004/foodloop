import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDonation } from '../../../../../services/donationApi';
import './DonationForm.css';

function DonationForm({ aiPredictions, imageUrl, error }) {
    const navigate = useNavigate();
    
    // Form state
    const [foodCategory, setFoodCategory] = useState('Cooked Meals');
    const [itemName, setItemName] = useState('Vegetable Curry with Rice');
    const [quantity, setQuantity] = useState(15);
    const [storage, setStorage] = useState('hot'); // hot, cold, dry
    const [pickup, setPickup] = useState('today'); // today, tomorrow
    const [aiConfidence, setAiConfidence] = useState(null);
    const [aiQualityScore, setAiQualityScore] = useState(null);
    const [isAiFilled, setIsAiFilled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

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
                preferredPickupDate: pickup,
                aiConfidence: aiConfidence || aiPredictions?.confidence || null,
                aiQualityScore: aiPredictions?.qualityScore || null,
                aiFreshness: aiPredictions?.freshness || null,
                aiDetectedItems: aiPredictions?.detectedItems || [],
            };

            console.log('[DonationForm] Submitting donation:', donationData);

            const response = await submitDonation(donationData);

            if (response.success) {
                console.log('[DonationForm] Donation submitted successfully:', response.donation);
                // Navigate to tracking page with donation ID
                navigate(`/donor/track-order?donationId=${response.donation.id}&trackingId=${response.donation.trackingId}`);
            } else {
                throw new Error(response.message || 'Failed to submit donation');
            }
        } catch (error) {
            console.error('[DonationForm] Error submitting donation:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.[0]?.message ||
                                error.message || 
                                'Failed to submit donation. Please try again.';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
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
                    <label>Food Category</label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            value={foodCategory}
                            onChange={(e) => {
                                setFoodCategory(e.target.value);
                                setIsEditing(true);
                            }}
                            readOnly={!isEditing && isAiFilled}
                        />
                        {(!isEditing || !isAiFilled) && <span className="edit-icon">📝</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Item Name</label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            value={itemName}
                            onChange={(e) => {
                                setItemName(e.target.value);
                                setIsEditing(true);
                            }}
                            readOnly={!isEditing && isAiFilled}
                        />
                        {(!isEditing || !isAiFilled) && <span className="edit-icon">📝</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Quantity / Servings</label>
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
                    <label>Storage Instructions</label>
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
                    <label>Pickup Window</label>
                    <div className="pickup-toggles">
                        <button
                            className={`pickup-btn ${pickup === 'today' ? 'active' : ''}`}
                            onClick={() => setPickup('today')}
                        >
                            <div className="pickup-btn-content">
                                <span className="day-label">Today</span>
                                <span className="time-label">4:00 PM - 5:30 PM</span>
                            </div>
                            <div className="pickup-icons">
                                <span className="calendar-icon">📅</span>
                                <span className="clock-icon">🕒</span>
                            </div>
                        </button>
                        <button
                            className={`pickup-btn ${pickup === 'tomorrow' ? 'active' : ''}`}
                            onClick={() => setPickup('tomorrow')}
                        >
                            <div className="pickup-btn-content">
                                <span className="day-label">Tomorrow</span>
                                <span className="time-label">10:00 AM - 12:00 PM</span>
                            </div>
                            <div className="pickup-icons">
                                <span className="calendar-icon">📅</span>
                                <span className="clock-icon">🕒</span>
                            </div>
                        </button>
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

            {/* Footer */}
            <div className="form-footer">
                <div className="checkbox-group">
                    <input type="checkbox" id="safety-confirm" />
                    <label htmlFor="safety-confirm">I confirm that all detected AI details are accurate and the food meets safety standards.</label>
                </div>

                <button 
                    className="post-donation-btn" 
                    onClick={handlePostDonation}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Post Donation ▶'}
                </button>

                <div className="progress-status">
                    <div className="progress-text">
                        You are 2 donations away from your Gold Donor badge!
                        <span className="progress-fraction">8/10 Completed</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '80%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonationForm;
