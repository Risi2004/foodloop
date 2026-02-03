import './ActionButtons.css';

const ActionButtons = () => {
    return (
        <div className="action-buttons-container">
            <button className="btn-secondary">
                <i className="fa-solid fa-cloud-arrow-down"></i> PDF
            </button>
            <button className="btn-primary">
                <i className="fa-solid fa-share-nodes"></i> Share Impact
            </button>
        </div>
    );
};

export default ActionButtons;
