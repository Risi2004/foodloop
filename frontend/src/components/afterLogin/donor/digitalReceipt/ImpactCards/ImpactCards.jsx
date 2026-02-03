import './ImpactCards.css';

const ImpactCards = () => {
    const cards = [
        {
            icon: 'fa-route',
            title: 'Distance Traveled',
            value: '2',
            unit: 'KM',
            gradient: false // Custom styling
        },
        {
            icon: 'fa-user-group',
            title: 'People Fed',
            value: '18',
            unit: '',
            gradient: true
        },
        {
            icon: 'fa-fire',
            title: 'Methane Saved',
            value: '0.5',
            unit: 'KG',
            gradient: true,
            badge: '+1%'
        }
    ];

    return (
        <div className="impact-cards-container">
            {cards.map((card, index) => (
                <div key={index} className="impact-card">
                    <div className="card-header">
                        <div className="card-icon-box">
                            <i className={`fa-solid ${card.icon}`}></i>
                        </div>
                        {card.badge && <span className="card-badge">{card.badge}</span>}
                    </div>

                    <div className="card-content">
                        <div className="card-title">{card.title}</div>
                        <div className="card-value">
                            {card.value}<span className="card-unit">{card.unit}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImpactCards;
