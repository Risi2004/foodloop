import './AdminUserManagement.css';

const MembersTable = () => {
    // Mock Data
    const members = [
        {
            id: 1,
            name: "KURUVI Committee",
            email: "kuruvi@gmail.com",
            role: "Receiver",
            subRole: "NGO",
            details: "zip",
            status: "Verified",
            isActive: true
        },
        {
            id: 2,
            name: "Jana nayahan",
            email: "thalapathy@gmail.com",
            role: "Doner",
            subRole: "Individual",
            details: "zip",
            status: "Verified",
            isActive: true
        },
        {
            id: 3,
            name: "Deva",
            email: "coolie@gmail.com",
            role: "Driver",
            subRole: "",
            details: "zip",
            status: "Inactive",
            isActive: false
        }
    ];

    return (
        <div className="members-section">
            <h2 className="section-title">Member</h2>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>USER NAME</th>
                            <th style={{ width: '20%' }}>ROLE</th>
                            <th style={{ width: '15%' }}>DETAILS</th>
                            <th style={{ width: '15%' }}>STATUS</th>
                            <th style={{ width: '25%' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="user-cell">
                                    <div className="user-name">{member.name}</div>
                                    <div className="user-email">{member.email}</div>
                                </td>
                                <td className="role-cell">
                                    <div className="role-main">{member.role}</div>
                                    {member.subRole && <div className="role-sub">{member.subRole}</div>}
                                </td>
                                <td className="details-cell">
                                    <div className="file-icon">
                                        {/* SVG for ZIP/File */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-archive"><path d="M4 22V4c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M10 2v2" /><path d="M10 8v2" /><path d="M10 14v2" /><path d="M10 20v2" /><path d="M14 2v2" /><path d="M14 8v2" /><path d="M14 14v2" /><path d="M14 20v2" /><path d="M4 2v20" /></svg>
                                        <span className="file-label">ZIP</span>
                                    </div>
                                </td>
                                <td className="status-cell">
                                    <span className={`status-badge ${member.status.toLowerCase()}`}>
                                        <span className="status-dot"></span>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    {member.isActive ? (
                                        <button className="action-btn-long deactivate">
                                            Deactivate
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    ) : (
                                        <button className="action-btn-long activate">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="btn-icon check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button className="page-nav prev">&lt;</button>
                <button className="page-num active">1</button>
                <button className="page-num">2</button>
                <button className="page-num">3</button>
                <span className="page-ellipsis">...</span>
                <button className="page-num">15</button>
                <button className="page-nav next">&gt;</button>
            </div>
        </div>
    );
};

export default MembersTable;
