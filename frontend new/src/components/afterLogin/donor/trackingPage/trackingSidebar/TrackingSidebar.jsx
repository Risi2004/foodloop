import DriverInfoCard from './DriverInfoCard';
import JourneyTimeline from './JourneyTimeline';
import WhatsNextCard from './WhatsNextCard';
import './TrackingSidebar.css';

function TrackingSidebar() {
    return (
        <div className="tracking-sidebar">
            {/* Driver & Delivery Info Card */}
            <DriverInfoCard />

            {/* Item Info (Simulated inside the main area or separate) */}
            <div className="donation-summary-card">
                <div className="donation-image-circle">
                    <img src="https://via.placeholder.com/60" alt="Avocado Toast" />
                </div>
                <div className="donation-details">
                    <h3>Avocado Toast (6pcs)</h3>
                    <p className="claimed-text">Claimed by Driver #402</p>
                    <div className="availability">
                        <span className="icon">🟢</span> 6pcs Available
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <JourneyTimeline />

            {/* What's Next / Footer Card */}
            <WhatsNextCard />
        </div>
    );
}

export default TrackingSidebar;
