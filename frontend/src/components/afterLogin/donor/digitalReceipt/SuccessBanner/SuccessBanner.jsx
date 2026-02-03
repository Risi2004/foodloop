import tick from "../../../../../assets/icons/afterLogin/donor/digital-reciept/Check-Mark.png"
import './SuccessBanner.css';

const SuccessBanner = () => {
    return (
        <div className="success-banner">
            <div className="success-icon-container">
                <div className="success-icon-circle">
                    {/* <i className="fa-solid fa-check"> */}
                        <img src={tick} alt="Tick-icon" />
                    {/* </i> */}
                </div>
            </div>
            <div className="success-text-content">
                <h1>Donation Successfully Completed</h1>
                <p>Your contribution has reached those in need.</p>
                <div className="success-status-badge">
                    Journey Status: Delivered
                </div>
            </div>
        </div>
    );
};

export default SuccessBanner;
