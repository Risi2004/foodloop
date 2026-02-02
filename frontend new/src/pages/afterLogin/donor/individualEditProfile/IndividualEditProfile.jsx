import React from 'react';
import EditSidebar from '../../../../components/afterLogin/donor/editProfile/editSidebar/EditSidebar';
import PersonalInfoForm from '../../../../components/afterLogin/donor/editProfile/personalInfoForm/PersonalInfoForm';
import './individualEditProfile.css';

function IndividualEditProfile() {
    return (
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
    );
}

export default IndividualEditProfile;
