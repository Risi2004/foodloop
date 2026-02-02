import './FoodSummary.css';


const FoodSummary = () => {
    return (
        <div className="food-summary-container">
            <h3 className="section-title">Food Information</h3>
            <div className="summary-card">
                <div className="food-image-container">
                    <img src="https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Avocado Toast" className="food-image" />
                </div>
                <div className="food-details">
                    <h4 className="food-name">Avocado Toast (6pcs)</h4>
                    <div className="driver-claim-status">Claimed by Driver #402</div>

                    <div className="availability-tag">
                        <i className="fa-solid fa-leaf"></i> 6pcs Available
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodSummary;
