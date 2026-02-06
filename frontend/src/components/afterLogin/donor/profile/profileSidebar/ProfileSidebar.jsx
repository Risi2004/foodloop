import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AchievementsCard from '../../../badges/AchievementsCard';
import './ProfileSidebar.css';

function ProfileSidebar({ user, badgeProgress }) {
    const contactName = user?.donorType === 'Business'
        ? (user?.businessName || 'Contact')
        : (user?.username || user?.email || 'Contact');

    return (
        <div className="profile-sidebar">
            <div className="sidebar-card">
                <div className="card-header">
                    <span className="section-icon">💼</span>
                    <h3>{user?.donorType === 'Business' ? 'Business Information' : 'Contact Information'}</h3>
                </div>
                <div className="info-group">
                    <label>Contact</label>
                    <p style={{ marginBottom: 0 }}>{contactName}</p>
                    {user?.email && <p className="contact-email">{user.email}</p>}
                </div>
                {user?.contactNo && (
                    <div className="info-group">
                        <label>Phone</label>
                        <p>{user.contactNo}</p>
                    </div>
                )}
                {user?.address && (
                    <div className="info-group">
                        <label>Pickup location</label>
                        <p>{user.address}</p>
                    </div>
                )}

                <div className="sidebar-map-container">
                    <MapContainer
                        center={[6.9271, 79.8612]}
                        zoom={11}
                        zoomControl={false}
                        dragging={false}
                        doubleClickZoom={false}
                        scrollWheelZoom={false}
                        touchZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                </div>
            </div>

            <div className="sidebar-card achievements-card">
                <AchievementsCard badgeProgress={badgeProgress} unitLabel="donations" />
            </div>
        </div>
    );
}

export default ProfileSidebar;
