import './RecentRequests.css';

const RecentRequests = ({ requests }) => {
    return (
        <div className="recent-requests-container">
            <div className="requests-header">
                <h3>Recent Request</h3>
                <button className="view-all-btn">View All</button>
            </div>

            <div className="requests-table-container">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th className="th-user">USER NAME</th>
                            <th>DATE</th>
                            <th>ROLE</th>
                            <th className="th-status">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="user-info">
                                        <span className="user-name">{req.name}</span>
                                        <span className="user-email">{req.email}</span>
                                    </div>
                                </td>
                                <td className="date-cell">{req.date}</td>
                                <td>
                                    <div className="role-info">
                                        <span className="role-type">{req.role}</span>
                                        <span className="role-org">{req.organization}</span>
                                    </div>
                                </td>
                                <td className="status-cell">
                                    <div className="action-buttons">
                                        <button className="action-btn approve" title="Approve">
                                            ✓
                                        </button>
                                        <button className="action-btn reject" title="Reject">
                                            ✕
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRequests;
