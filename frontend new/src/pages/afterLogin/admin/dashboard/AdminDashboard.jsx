import { useEffect } from 'react';
import AdminNavbar from '../../../../components/afterLogin/admin/navbar/AdminNavbar';
import './AdminDashboard.css'

function AdminDashboard() {
    useEffect(() => {
        document.body.classList.add('admin-mode');
        return () => {
            document.body.classList.remove('admin-mode');
        };
    }, []);

    return (
        <div className='dashboard'>
            <AdminNavbar />
        </div>
    )
}

export default AdminDashboard;