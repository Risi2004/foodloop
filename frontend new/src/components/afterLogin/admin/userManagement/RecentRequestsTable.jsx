import './AdminUserManagement.css'; 

const RecentRequestsTable = () => {
    // Mock Data
    const requests = [
        {
            id: 1,
            name: "Vijay kumar",
            email: "Vijaykumar@gmail.com",
            date: "Oct 24, 2023",
            role: "Doner",
            organization: "Weddinghall"
        },
        {
            id: 2,
            name: "Parasakthi",
            email: "theyasakthi@gmail.com",
            date: "Oct 24, 2023",
            role: "Doner",
            organization: "Individual"
        },
        {
            id: 3,
            name: "TVK Committee",
            email: "tvk@gmail.com",
            date: "Oct 24, 2023",
            role: "Receiver",
            organization: "NGO"
        }
    ];

    return (
        <div className="recent-requests-section">
            <h2 className="section-title">Recent Request</h2>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>USER NAME</th>
                            <th style={{ width: '20%' }}>DATE</th>
                            <th style={{ width: '25%' }}>ROLE</th>
                            <th style={{ width: '25%' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td className="user-cell">
                                    <div className="user-name">{req.name}</div>
                                    <div className="user-email">{req.email}</div>
                                </td>
                                <td className="date-cell">{req.date}</td>
                                <td className="role-cell">
                                    <div className="role-main">{req.role}</div>
                                    <div className="role-sub">{req.organization}</div>
                                </td>
                                <td className="action-cell">
                                    <button className="action-btn approve" title="Approve">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </button>
                                    <button className="action-btn reject" title="Reject">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                    <button className="action-btn view" title="View">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRequestsTable;
