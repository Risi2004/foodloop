import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TrackingMap from '../../../../components/afterLogin/donor/trackingPage/trackingMap/TrackingMap';
import TrackingSidebar from '../../../../components/afterLogin/donor/trackingPage/trackingSidebar/TrackingSidebar';
import ReceiverNavbar from "../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar";
import ReceiverFooter from "../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter";
import useLiveTracking from '../../../../hooks/useLiveTracking';
import './ReceiverTrackingPage.css';

function ReceiverTrackingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const donationId = searchParams.get('donationId');

    // Use live tracking hook
    const { trackingData, driverLocation, loading, error } = useLiveTracking(donationId, {
        interval: 5000, // Poll every 5 seconds
        enabled: !!donationId
    });

    // Check if donationId is provided
    useEffect(() => {
        if (!donationId) {
            alert('No donation ID provided');
            navigate('/receiver/my-claims');
        }
    }, [donationId, navigate]);

    if (loading && !trackingData) {
        return (
            <>
                <ReceiverNavbar />
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
                <ReceiverFooter />
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
                <ReceiverNavbar />
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
                                fontSize: '14px',
                                marginRight: '10px'
                            }}
                        >
                            Retry
                        </button>
                        <button 
                            onClick={() => navigate('/receiver/my-claims')} 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Back to My Claims
                        </button>
                    </div>
                </div>
                <ReceiverFooter />
            </>
        );
    }

    const trackingId = trackingData?.donation?.trackingId || 'N/A';

    return (
        <>
        <ReceiverNavbar />
            <div className="tracking-page">
                <header className="tracking-header">
                    <button className="back-btn" onClick={() => navigate('/receiver/my-claims')}>
                        {/* Back Arrow Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
                        </svg>
                        Back to My Claims
                    </button>
                    <div className="header-title-row">
                        <div>
                            <h1 className="page-title">Donation Tracking</h1>
                            <p className="tracking-id">Tracking ID: {trackingId}</p>
                        </div>
                        <button className="help-btn">
                            Get Help
                            <span className="robot-icon">🤖</span>
                        </button>
                    </div>
                </header>

                <main className="tracking-layout">
                    <section className="map-section">
                        <TrackingMap trackingData={trackingData} driverLocation={driverLocation} />
                    </section>
                    <aside className="sidebar-section">
                        <TrackingSidebar trackingData={trackingData} />
                    </aside>
                </main>
            </div>
            <ReceiverFooter />
        </>
    );
}

export default ReceiverTrackingPage;
