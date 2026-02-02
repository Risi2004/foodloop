import ProfileHeader from '../../../../components/afterLogin/donor/profile/profileHeader/ProfileHeader';
import ProfileSidebar from '../../../../components/afterLogin/donor/profile/profileSidebar/ProfileSidebar';
import ProfileStats from '../../../../components/afterLogin/donor/profile/profileStats/ProfileStats';
import RecentDonations from '../../../../components/afterLogin/donor/profile/recentDonations/RecentDonations';
import './DonorProfile.css';
function DonorProfile() {
    return (
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
    );
}

export default DonorProfile;
