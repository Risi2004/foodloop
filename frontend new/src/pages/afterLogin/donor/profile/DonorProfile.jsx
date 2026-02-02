import ProfileHeader from '../../../../components/afterLogin/donor/profile/profileHeader/ProfileHeader';
import ProfileSidebar from '../../../../components/afterLogin/donor/profile/profileSidebar/ProfileSidebar';
import ProfileStats from '../../../../components/afterLogin/donor/profile/profileStats/ProfileStats';
import RecentDonations from '../../../../components/afterLogin/donor/profile/recentDonations/RecentDonations';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter"
import './DonorProfile.css';
function DonorProfile() {
    return (
        <>
            <DonorNavbar />
            <div className="profile-page">
                <div className="profile-container">
                    <ProfileHeader />
                    <div className="profile-content">
                        <aside className="profile-sidebar-column">
                            <ProfileSidebar />
                        </aside>
                        <main className="profile-main-column">
                            <ProfileStats />
                            <RecentDonations />
                        </main>
                    </div>
                </div>
            </div>
            <DonorFooter />
        </>
    );
}

export default DonorProfile;
