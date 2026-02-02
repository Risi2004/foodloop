import React from 'react';
import './PersonalInfoForm.css';

function PersonalInfoForm() {
    return (
        <div className="personal-info-card">
            <div className="personal-info-header">
                <span className="icon">👤</span>
                <h3>Personal Information</h3>
            </div>

            <div className="personal-form-grid">
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" placeholder="Eg:-jjhon." />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Eg:-jjhon@gmail.com." />
                </div>
                <div className="form-group full-width">
                    <label>Contact number</label>
                    <input type="text" placeholder="Eg:-0758261526." />
                </div>
                <div className="form-group full-width">
                    <label>Pickup Address</label>
                    <textarea placeholder="Eg:-0758261526."></textarea>
                </div>
            </div>

            <div className="form-actions-bottom">
                <button className="cancel-btn">Cancel</button>
                <button className="save-btn">Save</button>
            </div>
        </div>
    );
}

export default PersonalInfoForm;
