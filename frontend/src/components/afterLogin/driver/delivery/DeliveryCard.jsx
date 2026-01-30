import schedule from "../../../../assets/icons/afterLogin/driver/schedule.svg";
import transit from "../../../../assets/icons/afterLogin/driver/transit.svg";
import './deliveryCard.css';

function DeliveryCard({ isSelected, onClick }) {
    return (
        <div
            className="delivery__card"
            onClick={onClick}
            style={{
                cursor: 'pointer',
                border: isSelected ? '5px solid #1F4E36' : '5px solid transparent', // Use transparent border to prevent layout shift
                borderRadius: '12px',
                transition: 'all 0.2s ease'
            }}
        >
            <div className="delivery__card__s1">
                <h4>Fresh Bakery Bakery</h4>
                <h5>0.5km Away</h5>
            </div>
            <p style={{ marginBottom: "15px" }}>Assorted Pastries • 4.2 kg</p>
            <div className="delivery__card__s2">
                <img src={schedule} alt="schedule" />
                <p>Expires in 15 min</p>
            </div>
            <button>
                <p>Confirm Pickup</p>
                <img src={transit} alt="pickup" />
            </button>
        </div>
    )
}

export default DeliveryCard;