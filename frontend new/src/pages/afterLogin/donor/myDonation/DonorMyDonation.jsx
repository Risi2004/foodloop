import DonationMedia from '../../../../components/afterLogin/donor/myDonation/donationMedia/DonationMedia';
import DonationForm from '../../../../components/afterLogin/donor/myDonation/donationForm/DonationForm';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter"
import './DonorMyDonation.css';

function DonorMyDontaion() {
    return (
        <>
            <DonorNavbar />
            <div className="new-donation-page">
                <div className="donation-container">
                    <main className="donation-content">
                        <DonationMedia />
                        <DonationForm />
                    </main>
                </div>
            </div>
            <DonorFooter />
        </>
    );
}

export default DonorMyDontaion;
