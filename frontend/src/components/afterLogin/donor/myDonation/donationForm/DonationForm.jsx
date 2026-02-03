import { useState } from 'react';
import { Link } from 'react-router-dom';
import './DonationForm.css';

function DonationForm() {
    // State for toggles
    const [storage, setStorage] = useState('hot'); // hot, cold, dry
    const [pickup, setPickup] = useState('today'); // today, tomorrow

    return (
        <div className="donation-form-container">
            {/* AI Analysis Banner */}
            <div className="ai-analysis-banner">
                <div className="analysis-status">
                    <span className="check-icon-circle">✓</span>
                    <span className="analysis-text">
                        AI Analysis: <span className="confidence">98% confidence</span> — Freshness Verified
                    </span>
                </div>
                <div className="safety-badge">⚡ High Safety</div>
            </div>

            {/* Core Details Header */}
            <div className="form-section-header">
                <div className="section-title">
                    <span className="magic-wand-icon">🪄</span>
                    <h2>Core Details</h2>
                    <span className="ai-filled-badge">(AI-Filled)</span>
                </div>
                <button className="edit-all-btn">Edit All Fields</button>
            </div>

            {/* Core Details Form */}
            <div className="form-grid">
                <div className="form-group">
                    <label>Food Category</label>
                    <div className="input-with-icon">
                        <input type="text" defaultValue="Cooked Meals" />
                        <span className="edit-icon">📝</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Item Name</label>
                    <div className="input-with-icon">
                        <input type="text" defaultValue="Vegetable Curry with Rice" />
                        <span className="edit-icon">📝</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Quantity / Servings</label>
                    <div className="quantity-control">
                        <button className="qty-btn minus">—</button>
                        <input type="text" defaultValue="15 Plates" className="qty-input" />
                        <button className="qty-btn plus">＋</button>
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
                            <span className="day-label">Today</span>
                            <span className="time-label">4:00 PM - 5:30 PM</span>
                        </button>
                        <button
                            className={`pickup-btn ${pickup === 'tomorrow' ? 'active' : ''}`}
                            onClick={() => setPickup('tomorrow')}
                        >
                            <span className="day-label">Tomorrow</span>
                            <span className="time-label">10:00 AM - 12:00 PM</span>
                        </button>
                    </div>

                    <div className="datetime-inputs">
                        <div className="date-input-wrapper">
                            <input type="text" defaultValue="03 Jan 2026" className="date-input" />
                            <span className="calendar-icon">📅</span>
                        </div>
                        <div className="time-input-wrapper">
                            <input type="text" defaultValue="10:00 AM - 12:00 PM" className="time-input" />
                            <span className="clock-icon">🕒</span>
                        </div>
                    </div>
                </div>

                <div className="impact-column">
                    <div className="impact-card">
                        <span className="share-icon">↗</span>
                        <div className="impact-content">
                            <label>Impact Estimate</label>
                            <div className="impact-value">
                                <span className="number">15</span>
                                <span className="unit">people</span>
                            </div>
                            <p className="impact-desc">will be fed from this donation!</p>
                        </div>
                        <div className="people-icon-group">
                            👥
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

                <button className="post-donation-btn">
                    <Link to="/donor/track-order">Post Donation ➤</Link>
                </button>

                <div className="progress-status">
                    <div className="progress-text">
                        You are 2 donations away from your Gold Donor Badge!
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
