import './ProfileStats.css';

function ProfileStats({ donations = [] }) {
    const totalItems = donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
    const deliveredCount = donations.filter(d => d.status === 'delivered').length;

    return (
        <div className="profile-stats">
            <div className="stat-card large-stat">
                <span className="stat-icon">📦</span>
                <h3>Items Donated</h3>
                <div className="stat-value">{donations.length}</div>
            </div>

            <div className="stat-card large-stat">
                <span className="stat-icon">👥</span>
                <h3>People Fed</h3>
                <div className="stat-value">{deliveredCount}</div>
            </div>

            <div className="stat-card large-stat">
                <span className="stat-icon">🔥</span>
                <h3>Total Quantity</h3>
                <div className="stat-value">
                    {totalItems}
                    <span className="stat-unit">units</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileStats;
