import './FoodCard.css';

const FoodCard = ({ item, onCardClick }) => {
    const donation = item.donation || item;
    const storageIcon = donation.storageRecommendation === 'Hot' ? '☀️' : 
                       donation.storageRecommendation === 'Cold' ? '❄️' : 
                       '💧';
    const storageText = donation.storageRecommendation || 'N/A';
    
    // Show AI verified badge if quality score is >= 0.8
    const showAIBadge = donation.aiQualityScore !== null && 
                       donation.aiQualityScore !== undefined && 
                       donation.aiQualityScore >= 0.8;

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(item);
        }
    };

    return (
        <div className="food-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            {showAIBadge && (
                <div className="card-badge verified">
                    <span className="dot"></span> AI verified
                </div>
            )}
            <button className="claim-btn">Claim now</button>

            <div className="card-content">
                <div className="card-image-container">
                    <img 
                        src={item.image || donation.imageUrl || '/placeholder-food.jpg'} 
                        alt={item.title || donation.itemName} 
                        className="card-image"
                        onError={(e) => {
                            e.target.src = '/placeholder-food.jpg';
                        }}
                    />
                </div>

                <div className="card-details">
                    <h3 className="card-title">{item.title || donation.itemName || 'Food Item'}</h3>
                    <p className="card-meta">Listed {item.listedTime || 'Recently'}</p>
                    <p className="card-meta highlight">EXP: {item.expiry || 'N/A'}</p>

                    <div className="card-qty">
                        <span className="icon">🟢</span> {item.quantity || 'N/A'}
                    </div>
                </div>

                <div className="card-impact-section">
                    <div className="impact-box">
                        <span className="impact-label">Impact Estimate</span>
                        <div className="impact-value">
                            <span className="number">{item.impactPeople || donation.quantity || 0}</span>
                            <span className="unit">People</span>
                        </div>
                    </div>
                    <div className="storage-type">
                        {storageText} {storageIcon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
