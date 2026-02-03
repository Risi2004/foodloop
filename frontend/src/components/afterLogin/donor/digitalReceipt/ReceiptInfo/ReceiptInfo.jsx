import './ReceiptInfo.css';

const ReceiptInfo = () => {
    return (
        <div className="receipt-info-container">
            <div className="info-block donor-info">
                <span className="info-label">Donor Information</span>
                <h2 className="info-name">Sarah Jenkins</h2>
                <a href="mailto:sarah.j@impact.com" className="info-email">sarah.j@impact.com</a>
            </div>

            <div className="info-block org-info">
                <span className="info-label text-right">Handling Organization</span>
                <h2 className="info-name text-right">Community Harvest NGO</h2>
                <div className="delivery-time text-right">Delivered: Oct 24, 2023</div>

                <div className="location-badge">
                    <div className="icon-box">
                        <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="location-text">
                        <span className="location-label">Drop Location</span>
                        <span className="location-detail">0.8 mi to recipient (Central Community Center)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptInfo;
