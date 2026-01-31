import React from 'react';
import liveJourneyIcon from "../../../../../assets/icons/afterLogin/driver/Live-Journey.svg";
import locationIcon from "../../../../../assets/icons/afterLogin/driver/location.svg";
import volunteerIcon from "../../../../../assets/icons/afterLogin/driver/scooter.svg";
import receiverIcon from "../../../../../assets/icons/afterLogin/driver/received.svg";
import trendUpIcon from "../../../../../assets/icons/afterLogin/driver/Trend-Up.svg";
import trophyIcon from "../../../../../assets/icons/afterLogin/driver/Trophy.svg";
import CupIcon from "../../../../../assets/icons/afterLogin/driver/Mandriva.svg"
import './LiveJourney.css';

function LiveJourney() {
    return (
        <div className="live-journey-card">
            <div className="live-journey-header">
                <img src={liveJourneyIcon} alt="Live Journey" className="header-icon" />
                <h2>Live Journey</h2>
            </div>

            <div className="live-journey-body">
                <img src={trendUpIcon} alt="" className="background-graph" />

                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-marker green">
                            <img src={locationIcon} alt="Location" />
                        </div>
                        <div className="timeline-content">
                            <p className="step-status green-text">Item Listed</p>
                            <h4 className="step-title">Donation confirmed by Donor</h4>
                            <p className="step-meta">Oct 26, 11:30 AM • Verified by NGO</p>
                        </div>
                    </div>

                    <div className="timeline-item active">
                        <div className="timeline-connector green-line"></div>
                        <div className="timeline-marker blue">
                            <img src={volunteerIcon} alt="Volunteer" />
                        </div>
                        <div className="timeline-content">
                            <p className="step-status blue-text">With Volunteer</p>
                            <h4 className="step-title">Picked up by Sarah J.</h4>
                            <p className="step-meta">Oct 26, 12:15 PM • On the way</p>
                        </div>
                    </div>

                    {/* Reached the Needy */}
                    <div className="timeline-item pending">
                        <div className="timeline-connector blue-line"></div>
                        <div className="timeline-marker orange">
                            <img src={receiverIcon} alt="Receiver" />
                        </div>
                        <div className="timeline-content">
                            <p className="step-status orange-text">Reached the Needy</p>
                            <h4 className="step-title">Pending Drop-off</h4>
                            <p className="step-meta">Estimated arrival: 12:45 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="impact-progress">
                <div className="impact-header">
                    <h4>Your Impact Progress</h4>
                    <div className="badge">
                        <img src={trophyIcon} alt="Trophy" />
                        <span>Community Hero</span>
                    </div>
                </div>

                <div className="progress-container">
                    <div className="progress-labels">
                        <div className="progress-label-left">
                            <span className="star-icon"><img src={CupIcon} alt="Cup-Icon" /></span>
                            <span>12/15 Pickups Completed</span>
                        </div>
                        <span className="progress-percentage">80%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '80%' }}></div>
                    </div>
                    <p className="progress-quote">"Just 3 more pickups to earn your next badge!"</p>
                </div>
            </div>
        </div>
    );
}

export default LiveJourney;