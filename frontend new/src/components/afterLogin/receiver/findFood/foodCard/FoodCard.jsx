import './FoodCard.css';

const FoodCard = ({ item }) => {
    return (
        <div className="food-card">
            <div className="card-badge verified">
                <span className="dot"></span> AI verified
            </div>
            <button className="claim-btn">Claim now</button>

            <div className="card-content">
                <div className="card-image-container">
                    <img src={item.image} alt={item.title} className="card-image" />
                </div>

                <div className="card-details">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-meta">Listed {item.listedTime}</p>
                    <p className="card-meta highlight">EXP: {item.expiry}</p>

                    <div className="card-qty">
                        <span className="icon">🟢</span> {item.quantity}
                    </div>
                </div>

                <div className="card-impact-section">
                    <div className="impact-box">
                        <span className="impact-label">Impact Estimate</span>
                        <div className="impact-value">
                            <span className="number">{item.impactPeople}</span>
                            <span className="unit">People</span>
                        </div>
                    </div>
                    <div className="storage-type">
                        Cold ❄️
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
