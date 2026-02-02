import DonationMedia from '../../../../components/afterLogin/donor/myDonation/donationMedia/DonationMedia';
import DonationForm from '../../../../components/afterLogin/donor/myDonation/donationForm/DonationForm';
import './DonorMyDonation.css';

function DonorMyDontaion() {
    return (
        <div className="new-donation-page">
            <div className="donation-container">
                <main className="donation-content">
                    <DonationMedia />
                    <DonationForm />
                </main>
            </div>
        </div>
    );
}

export default DonorMyDontaion;
