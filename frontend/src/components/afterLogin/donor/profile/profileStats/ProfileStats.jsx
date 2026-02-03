import './ProfileStats.css';

function ProfileStats() {
    return (
        <div className="profile-stats">
            <div className="stat-card large-stat">
                <span className="stat-icon">📦</span>
                <span className="stat-growth positive">+11%</span>
                <h3>Items Donated</h3>
                <div className="stat-value">2,568</div>
            </div>

            <div className="stat-card large-stat">
                <span className="stat-icon">👥</span>
                <span className="stat-growth positive">+5%</span>
                <h3>People Fed</h3>
                <div className="stat-value">568</div>
            </div>

            <div className="stat-card large-stat">
                <span className="stat-icon">🔥</span>
                <span className="stat-growth positive">+1%</span>
                <h3>Methane Saved</h3>
                <div className="stat-value">
                    25
                    <span className="stat-unit">KG</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileStats;
