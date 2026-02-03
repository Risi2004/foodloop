import './DigitalReceipt.css';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter"
import SuccessBanner from '../../../../components/afterLogin/donor/digitalReceipt/SuccessBanner/SuccessBanner';
import ReceiptInfo from '../../../../components/afterLogin/donor/digitalReceipt/ReceiptInfo/ReceiptInfo';
import ImpactCards from '../../../../components/afterLogin/donor/digitalReceipt/ImpactCards/ImpactCards';
import FoodSummary from '../../../../components/afterLogin/donor/digitalReceipt/FoodSummary/FoodSummary';
import DriverSummary from '../../../../components/afterLogin/donor/digitalReceipt/DriverSummary/DriverSummary';
import ActionButtons from '../../../../components/afterLogin/donor/digitalReceipt/ActionButtons/ActionButtons';

const DigitalReceipt = () => {
    return (
        <>
        <DonorNavbar />
            <div className="digital-receipt-container">
                <div className="back-link">
                    <i className="fa-solid fa-arrow-left"></i> Back to My Donations
                </div>

                <div className="receipt-content">
                    <SuccessBanner />

                    <div className="receipt-details-card">
                        <ReceiptInfo />

                        <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', marginBottom: '15px' }}>IMPACT SUMMARY</h3>
                        {/* Wait, the design doesn't really have "IMPACT SUMMARY" explicitly labeled but it separates the sections. 
               Looking at the image, there is a separator line or just spacing.
               The Impact Cards are just there.
           */}
                        <div style={{ width: '100%', height: '1px', backgroundColor: '#e0e0e0', marginBottom: '20px', marginTop: '-20px', opacity: 0.5 }}></div>

                        <ImpactCards />

                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px', marginTop: '30px' }}>Delivery Information</h3>

                        <div className="bottom-summary-section">
                            <FoodSummary />
                            <DriverSummary />
                        </div>

                        <ActionButtons />
                    </div>
                </div>
            </div>
            <DonorFooter />
        </>
    );
};

export default DigitalReceipt;
