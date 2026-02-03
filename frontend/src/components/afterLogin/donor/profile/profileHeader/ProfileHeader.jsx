import { Link } from 'react-router-dom';
import './ProfileHeader.css';

function ProfileHeader() {
    return (
        <div className="profile-header">
            <div className="profile-info">
                <div className="profile-avatar-container">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop" alt="Store Front" className="profile-avatar" />
                </div>
                <div className="profile-details">
                    <div className="profile-title-row">
                        <h1 className="profile-name">GreenGrocer Co.</h1>
                        <span className="verified-badge">
                            <span className="check-icon">✓</span> Verified Donor
                        </span>
                    </div>
                    <p className="profile-type">supermarket</p>
                    <p className="profile-meta">Member since January 2023</p>
                    <div className="profile-location-row">
                        <span className="calendar-icon">📅</span> Member since Oct 2021
                    </div>
                    <div className="profile-location-row">
                        <span className="location-icon">📍</span> Downtown District, NY
                    </div>
                </div>
            </div>
            <div className="profile-actions">
               <Link to="/donor/edit-profile"><button className="edit-btn">Edit</button></Link> 
                <button className="new-donation-btn">New Donation</button>
            </div>
        </div>
    );
}

export default ProfileHeader;
