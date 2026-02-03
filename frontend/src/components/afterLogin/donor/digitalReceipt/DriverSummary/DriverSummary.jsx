import scooterIcon from "../../../../../assets/icons/afterLogin/donor/digital-reciept/scooter.png"
import './DriverSummary.css';

const DriverSummary = () => {
    return (
        <div className="driver-summary-container">
            <h3 className="section-title text-right-mobile">Driver Information</h3>
            <div className="summary-card driver-card-layout">
                <div className="driver-info-left">
                    <div className="info-row">
                        <div className="icon-c circle-blue">
                            <img src={scooterIcon} alt="Scooter" />
                        </div>
                        <div className="info-text-group">
                            <div className="label-tiny">Current Location</div>
                            <div className="value-small">0.8 mi to recipient (Central Community Center)</div>
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="icon-c">
                            <img src={scooterIcon} alt="Scooter" />
                        </div>
                        <div className="info-text-group">
                            <div className="label-tiny">Vehicle Type</div>
                            <div className="value-small">scooters</div>
                        </div>
                    </div>
                </div>

                <div className="driver-info-right">
                    <div className="info-row end">
                        <div className="info-text-group text-right">
                            <div className="value-small">Sarah J. (Volunteer)</div>
                        </div>
                        <div className="driver-avatar">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80" alt="Driver" />
                        </div>
                    </div>
                    <div className="info-row end">
                        <div className="info-text-group text-right">
                            <div className="label-tiny">Vehicle Number</div>
                            <div className="value-small">BYD - 2418</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="action-buttons-wrapper">
                {/* Action Buttons will be inserted here or as a sibling component */}
                {/* For layout purposes, the design shows buttons below the card but aligned right? 
                   No, the buttons are below the driver card, aligned right. 
                   Actually, looking at the layout:
                   Left: Food Info
                   Right: Driver Info (Top), Buttons (Bottom)
                */}
            </div>
        </div>
    );
};

export default DriverSummary;
