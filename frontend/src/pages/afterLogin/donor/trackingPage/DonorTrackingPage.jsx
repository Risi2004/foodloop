import TrackingMap from '../../../../components/afterLogin/donor/trackingPage/trackingMap/TrackingMap';
import TrackingSidebar from '../../../../components/afterLogin/donor/trackingPage/trackingSidebar/TrackingSidebar';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter";
import './DonorTrackingPage.css';

function DonorTrackingPage() {
    return (
        <>
        <DonorNavbar />
            <div className="tracking-page">
                <header className="tracking-header">
                    <button className="back-btn">
                        {/* Back Arrow Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
                        </svg>
                        Back to My Donations
                    </button>
                    <div className="header-title-row">
                        <div>
                            <h1 className="page-title">Donation Tracking</h1>
                            <p className="tracking-id">Tracking ID: #FL-8829-01</p>
                        </div>
                        <button className="help-btn">
                            Get Help
                            <span className="robot-icon">🤖</span>
                        </button>
                    </div>
                </header>

                <main className="tracking-layout">
                    <section className="map-section">
                        <TrackingMap />
                    </section>
                    <aside className="sidebar-section">
                        <TrackingSidebar />
                    </aside>
                </main>
            </div>
            <DonorFooter />
        </>
    );
}

export default DonorTrackingPage;
