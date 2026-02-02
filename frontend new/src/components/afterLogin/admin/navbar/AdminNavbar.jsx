import { Link } from 'react-router-dom';
import dashboardIcon from "../../../../assets/icons/afterLogin/admin/dashboard.svg";
import managementIcon from "../../../../assets/icons/afterLogin/admin/management.svg";
import notificationIcon from "../../../../assets/icons/afterLogin/admin/notifications.svg";
import reviewIcon from "../../../../assets/icons/afterLogin/admin/review.svg";
import messageIcon from "../../../../assets/icons/afterLogin/admin/messages.svg"
import './AdminNavbar.css'

function AdminNavbar() {
    return (
        <>
            <div className='sidebar'>
                <img src="/logo.png" alt="" /> <br />
                <h1><span className='sidebar__s1__sub1'>Food</span><span className='sidebar__s1__sub2'>Loop</span></h1>
                <p>Zero Waste. Infinite Impact</p>
                <div className='sidebar__s2'>
                    <div className='sidebar__links'>
                        <img src={dashboardIcon} alt="" />
                        <Link>Dashboard Overview</Link>
                    </div>
                    <div className='sidebar__links'>
                        <img src={managementIcon} alt="" />
                        <Link>User Management</Link>
                    </div>
                    <div className='sidebar__links'>
                        <img src={notificationIcon} alt="" />
                        <Link>Notification</Link>
                    </div>
                    <div className='sidebar__links'>
                        <img src={reviewIcon} alt="" />
                        <Link>Reviews</Link>
                    </div>
                    <div className='sidebar__links'>
                        <img src={messageIcon} alt="" />
                        <Link>Messages</Link>
                    </div>
                </div>
                <button>Log Out</button>
            </div>
            <div className='responsive__navbar'>
                <div className=''>
                    <img className='responsive__navbar__logo' src="/logo.png" alt="Logo" />
                    <h1><span className='sidebar__s1__sub1'>Food</span><span className='sidebar__s1__sub2'>Loop</span></h1>
                    <p>Zero Waste. Infinite Impact</p>
                </div>
            </div>

        </>
    )
}

export default AdminNavbar;