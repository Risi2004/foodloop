import { useState } from 'react';
import RecentRequestsTable from './RecentRequestsTable';
import MembersTable from './MembersTable';
import SearchFilter from './SearchFilter';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Callback to refresh MembersTable when a user is approved/rejected
    const handleUserStatusChange = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="user-manage-page">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage, verify, and monitor all ecosystem participants from a central hub.</p>
            </div>

            <RecentRequestsTable onUserStatusChange={handleUserStatusChange} />

            <SearchFilter />

            <MembersTable refreshTrigger={refreshTrigger} />
        </div>
    );
};

export default AdminUserManagement;
