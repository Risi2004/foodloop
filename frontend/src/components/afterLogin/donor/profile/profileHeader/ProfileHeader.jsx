import { Link } from 'react-router-dom';
import './ProfileHeader.css';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop';

function formatMemberSince(createdAt) {
    if (!createdAt) return '';
    const d = new Date(createdAt);
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    return `${month} ${year}`;
}

function ProfileHeader({ user }) {
    const displayName = user?.donorType === 'Business'
        ? (user?.businessName || 'Business Donor')
        : (user?.username || user?.email || 'Donor');
    const displayType = user?.donorType === 'Business'
        ? (user?.businessType || 'business')
        : 'Individual';
    const memberSince = formatMemberSince(user?.createdAt);
    const avatarUrl = user?.profileImageUrl || DEFAULT_AVATAR;
    const isVerified = user?.status === 'completed';

    return (
        <div className="profile-header">
            <div className="profile-info">
                <div className="profile-avatar-container">
                    <img src={avatarUrl} alt="Profile" className="profile-avatar" />
                </div>
                <div className="profile-details">
                    <div className="profile-title-row">
                        <h1 className="profile-name">{displayName}</h1>
                        {isVerified && (
                            <span className="verified-badge">
                                <span className="check-icon">✓</span> Verified Donor
                            </span>
                        )}
                    </div>
                    <p className="profile-type">{displayType}</p>
                    {memberSince && (
                        <p className="profile-meta">Member since {memberSince}</p>
                    )}
                    {user?.address && (
                        <div className="profile-location-row">
                            <span className="location-icon">📍</span> {user.address}
                        </div>
                    )}
                </div>
            </div>
            <div className="profile-actions">
                <Link to="/donor/edit-profile"><button className="edit-btn">Edit</button></Link>
                <Link to="/donor/new-donation"><button className="new-donation-btn">New Donation</button></Link>
            </div>
        </div>
    );
}

export default ProfileHeader;
