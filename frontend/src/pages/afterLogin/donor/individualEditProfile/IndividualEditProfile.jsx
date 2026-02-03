import React from 'react';
import EditSidebar from '../../../../components/afterLogin/donor/editProfile/editSidebar/EditSidebar';
import PersonalInfoForm from '../../../../components/afterLogin/donor/editProfile/personalInfoForm/PersonalInfoForm';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter"
import './IndividualEditProfile.css';

function IndividualEditProfile() {
    return (
        <>
            <DonorNavbar />
            <div className="individual-edit-profile-page">
                <div className="individual-edit-container">
                    <aside className="individual-sidebar-section">
                        <EditSidebar
                            name="Alex Johnson"
                            subtitle="Manage your public profile and personal preferences."
                            memberSince="Oct 2023"
                        />
                    </aside>
                    <main className="individual-forms-section">
                        <PersonalInfoForm />
                    </main>
                </div>
            </div>
            <DonorFooter />
        </>
    );
}

export default IndividualEditProfile;
