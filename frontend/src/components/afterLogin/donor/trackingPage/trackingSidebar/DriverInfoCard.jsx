import './DriverInfoCard.css';

function DriverInfoCard() {
    return (
        <div className="driver-info-card">
            <div className="info-row">
                <div className="icon-box blue">
                    🛵
                </div>
                <div className="info-content">
                    <span className="label">Current Location</span>
                    <span className="value">0.8 mi to recipient (Central Community Center)</span>
                </div>
                <div className="driver-profile">
                    <img src="https://via.placeholder.com/40" alt="Sarah J" />
                    <span className="driver-name">Sarah J. (Volunteer)</span>
                </div>
            </div>

            <div className="divider"></div>

            <div className="info-row">
                <div className="icon-box blue-outline">
                    🏍️
                </div>
                <div className="info-content">
                    <span className="label">Vehicle Type</span>
                    <span className="value">scooters</span>
                </div>
                <div className="vehicle-number">
                    <span className="label">Vehicle Number</span>
                    <span className="value">BYD - 2418</span>
                </div>
            </div>
        </div>
    );
}

export default DriverInfoCard;
