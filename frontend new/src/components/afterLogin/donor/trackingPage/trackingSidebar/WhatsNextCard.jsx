
import './WhatsNextCard.css';

function WhatsNextCard() {
    return (
        <div className="whats-next-card">
            <div className="card-header">
                <span className="icon">🛡️</span>
                <h4>What's Next?</h4>
            </div>
            <p className="card-desc">
                Once the volunteer reaches the destination, you will receive a digital proof of delivery and your Impact Score will be updated.
            </p>
            <div className="status-pill">
                <span className="icon">🧾</span> Awaiting digital receipt
            </div>
        </div>
    );
}

export default WhatsNextCard;
