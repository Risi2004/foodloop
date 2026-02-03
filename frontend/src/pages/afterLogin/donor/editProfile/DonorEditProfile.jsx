import EditSidebar from '../../../../components/afterLogin/donor/editProfile/editSidebar/EditSidebar';
import BusinessInfoForm from '../../../../components/afterLogin/donor/editProfile/businessInfoForm/BusinessInforForm';
import AddBranchesForm from '../../../../components/afterLogin/donor/editProfile/addBranchesForm/AddBranchesForm';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter"
import './DonorEditProfile.css';

function DonorEditProfile() {
    return (
        <>
            <DonorNavbar />
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
            <DonorFooter />
        </>
    );
}

export default DonorEditProfile;
