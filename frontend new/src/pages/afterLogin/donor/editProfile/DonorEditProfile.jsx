import EditSidebar from '../../../../components/afterLogin/donor/editProfile/editSidebar/EditSidebar';
import BusinessInfoForm from '../../../../components/afterLogin/donor/editProfile/businessInfoForm/BusinessInforForm';
import AddBranchesForm from '../../../../components/afterLogin/donor/editProfile/addBranchesForm/AddBranchesForm';
import './DonorEditProfile.css';

function DonorEditProfile() {
    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <aside className="edit-sidebar-section">
                    <EditSidebar />
                </aside>
                <main className="edit-forms-section">
                    <BusinessInfoForm />
                    <AddBranchesForm />
                </main>
            </div>
        </div>
    );
}

export default DonorEditProfile;
