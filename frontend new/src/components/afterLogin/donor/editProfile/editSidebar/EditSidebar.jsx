import React from 'react';
import './EditSidebar.css';

function EditSidebar({
    name = "GreenGrocer Co.",
    subtitle = "Manage your business identity, branch locations, and security settings.",
    type = "Active Donor",
    memberSince = "Oct 2023"
}) {
    return (
        <div className="edit-sidebar-card">
            <h1 className="edit-title">Edit Profile</h1>
            <p className="edit-subtitle">
                {subtitle}
            </p>

            <div className="avatar-section">
                <div className="avatar-circle">
                    {/* Placeholder Avatar Icon */}
                    <svg className="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <button className="camera-btn">
                        📷
                    </button>
                </div>
            </div>

            <div className="active-donor-badge">{type}</div>

            <h2 className="business-name">{name}</h2>
            <p className="member-since">Member Since {memberSince}</p>

            <button className="change-password-btn">
                <span className="lock-icon">🔒</span> Change Password
            </button>
        </div>
    );
}

export default EditSidebar;
