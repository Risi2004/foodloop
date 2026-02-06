import schedule from "../../../../assets/icons/afterLogin/driver/schedule.svg";
import transit from "../../../../assets/icons/afterLogin/driver/transit.svg";
import './DeliveryCard.css';

function DeliveryCard({ donation, isSelected, onClick, onAcceptOrder, isAccepting }) {
    if (!donation) {
        return null;
    }

    // Format quantity display
    const formatQuantity = (quantity) => {
        if (!quantity) return 'N/A';
        return `${quantity} ${quantity === 1 ? 'serving' : 'servings'}`;
    };

    const donorName = donation.donorName || 'Donor';
    const distanceText = donation.driverToDonorDistanceFormatted || 'Distance N/A';
    const itemName = donation.itemName || 'Food Item';
    const quantity = formatQuantity(donation.quantity);
    const expiryText = donation.expiryText || 'Expired';

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
                <h4>{donorName}</h4>
                <h5>{distanceText} Away</h5>
            </div>
            <p style={{ marginBottom: "15px" }}>{itemName} • {quantity}</p>
            <div className="delivery__card__s2">
                <img src={schedule} alt="schedule" />
                <p>{expiryText}</p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAcceptOrder?.(donation);
                }}
                disabled={isAccepting}
            >
                <p>{isAccepting ? 'Accepting...' : 'Accept order'}</p>
                <img src={transit} alt="pickup" />
            </button>
        </div>
    )
}

export default DeliveryCard;