import './JourneyTimeline.css';

function JourneyTimeline() {
    return (
        <div className="journey-timeline-card">
            <h4 className="timeline-title">((●)) Live Journey</h4>

            <div className="timeline-container">
                {/* Step 1: Item Listed */}
                <div className="timeline-item completed">
                    <div className="timeline-marker green">
                        <span className="icon">📍</span>
                    </div>
                    <div className="timeline-content">
                        <span className="status-label green">Item Listed</span>
                        <p className="status-desc">Donation confirmed by Donor</p>
                        <span className="time-stamp">Oct 26, 11:30 AM • Verified by NGO</span>
                    </div>
                </div>

                {/* Step 2: With Volunteer */}
                <div className="timeline-item active">
                    <div className="timeline-marker blue">
                        <span className="icon">🛵</span>
                    </div>
                    <div className="timeline-content">
                        <span className="status-label blue">With Volunteer</span>
                        <p className="status-desc">Picked up by Sarah J.</p>
                        <span className="time-stamp">Oct 26, 12:15 PM • On the way</span>
                    </div>
                </div>

                {/* Step 3: Pending Drop-off */}
                <div className="timeline-item next">
                    <div className="timeline-marker red">
                        <span className="icon">📦</span>
                    </div>
                    <div className="timeline-content">
                        <span className="status-label gray">Reached the Needy</span>
                        <p className="status-desc">Pending Drop-off</p>
                        <span className="time-stamp">Estimated arrival: 12:45 PM</span>
                    </div>
                </div>

                {/* Timeline Line Connector */}
                <div className="timeline-line"></div>
            </div>
        </div>
    );
}

export default JourneyTimeline;
