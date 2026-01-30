import schedule from "../../../../assets/icons/afterLogin/driver/schedule.svg";
import checkIcon from "../../../../assets/icons/afterLogin/driver/check_circle.svg";
import './DeliveredCard.css';

function DeliveredCard() {
    return (
        <>
            <div className="delivered__card">
                <div className="delivered__card__sub">
                    <img src={checkIcon} alt="check" />
                    <p>Supplied</p>
                </div>
                <div className="delivery__card__s1">
                    <h4>Fresh Bakery Bakery</h4>
                    <h5>0.5km Away</h5>
                </div>
                <p style={{ marginBottom: "15px" }}>Assorted Pastries • 4.2 kg</p>
                <div className="delivery__card__s2">
                    <img src={schedule} alt="schedule" />
                    <p>Delivered Yesterday</p>
                </div>
            </div >
        </>
    )
}

export default DeliveredCard;