import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ProfileSidebar.css';

function ProfileSidebar() {
    return (
        <div className="profile-sidebar">
            <div className="sidebar-card">
                <div className="card-header">
                    <span className="section-icon">💼</span>
                    <h3>Business Information</h3>
                </div>
                <div className="info-group">
                    <label>Registration No.</label>
                    <p>REG-882910-NYC</p>
                </div>
                <div className="info-group">
                    <label>Tax ID / VAT</label>
                    <p>TX-554201-B</p>
                </div>
                <div className="info-group">
                    <label>Sustainability Contact</label>
                    <p style={{ marginBottom: 0 }}>Sarah Jenkins</p>
                    <p className="contact-email">s.jenkins@gmail.com</p>
                </div>
                <div className="info-group">
                    <label>pickup location</label>
                    <p>123 Sustainability Way</p>
                    <p>Downtown Financial District, NY 10004</p>
                </div>

                <div className="sidebar-map-container">
                    {/* Using a simple static view for the sidebar map as per design image */}
                    <MapContainer
                        center={[6.9271, 79.8612]} // Colombo
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

            <div className="sidebar-card active-branches-card">
                <div className="card-header">
                    <span className="section-icon">🏢</span>
                    <h3>Active Branches</h3>
                </div>
                <div className="branch-info">
                    <h4>Upper West Side</h4>
                    <p>BRANCH CODE -001</p>
                </div>
            </div>

            <div className="sidebar-card achievements-card">
                <div className="card-header">
                    <span className="section-icon">🏅</span>
                    <h3>Achievements & Badges</h3>
                </div>

                <div className="gold-member-banner">
                    <div className="medal-icon main-medal">🥇</div>
                    <span className="tier-name">Gold Member</span>
                </div>

                <div className="badges-row">
                    <div className="badge gold"><span>🎗️</span></div>
                    <div className="badge bronze"><span>🥉</span></div>
                    <div className="badge bronze"><span>🥉</span></div>
                    <div className="badge silver"><span>🥈</span></div>
                    <div className="badge silver"><span>🥈</span></div>
                </div>

                <div className="next-badge-progress">
                    <p>203 points to next Badges</p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSidebar;
