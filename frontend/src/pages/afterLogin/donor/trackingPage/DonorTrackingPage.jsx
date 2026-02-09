import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TrackingMap from '../../../../components/afterLogin/donor/trackingPage/trackingMap/TrackingMap';
import TrackingSidebar from '../../../../components/afterLogin/donor/trackingPage/trackingSidebar/TrackingSidebar';
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter";
import useLiveTracking from '../../../../hooks/useLiveTracking';
import './DonorTrackingPage.css';

function DonorTrackingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const rawId = searchParams.get('donationId');
    const donationId = rawId && rawId !== 'undefined' && rawId.trim() !== '' ? rawId.trim() : null;

    // Use live tracking hook (only when we have a valid donationId)
    const { trackingData, driverLocation, loading, error } = useLiveTracking(donationId, {
        interval: 2500,
        enabled: !!donationId
    });

    useEffect(() => {
        if (!donationId) {
            alert('No donation ID provided');
            navigate('/donor/my-donation');
        }
    }, [donationId, navigate]);

    if (!donationId) {
        return null;
    }

    if (!trackingData && loading) {
        return (
            <>
                <DonorNavbar />
                <div className="tracking-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="loading-spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #1F4E36',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }}></div>
                        <p style={{ color: '#1F4E36', fontSize: '16px' }}>Loading tracking data...</p>
                    </div>
                </div>
                <DonorFooter />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

    if (error && !trackingData) {
        return (
            <>
                <DonorNavbar />
                <div className="tracking-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px', padding: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#d32f2f', fontSize: '16px', marginBottom: '16px' }}>⚠️ {error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#1F4E36',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
                <DonorFooter />
            </>
        );
    }

    const trackingId = trackingData?.donation?.trackingId || 'N/A';

    return (
        <>
        <DonorNavbar />
            <div className="tracking-page">
                <header className="tracking-header">
                    <div className="header-title-row">
                        <div>
                            <h1 className="page-title">Donation Tracking</h1>
                            <p className="tracking-id">Tracking ID: {trackingId}</p>
                        </div>
                    </div>
                </header>

                <main className="tracking-layout">
                    <section className="map-section">
                        <TrackingMap trackingData={trackingData} driverLocation={driverLocation} />
                    </section>
                    <aside className="sidebar-section">
                        <TrackingSidebar trackingData={trackingData} driverLocation={driverLocation} />
                    </aside>
                </main>
            </div>
            <DonorFooter />
        </>
    );
}

export default DonorTrackingPage;
