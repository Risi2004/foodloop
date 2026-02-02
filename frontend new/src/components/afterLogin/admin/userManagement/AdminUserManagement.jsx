import RecentRequestsTable from './RecentRequestsTable';
import MembersTable from './MembersTable';
import SearchFilter from './SearchFilter';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    return (
        <div className="user-manage-page">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage, verify, and monitor all ecosystem participants from a central hub.</p>
            </div>

            <RecentRequestsTable />

            <SearchFilter />

            <MembersTable />
        </div>
    );
};

export default AdminUserManagement;
