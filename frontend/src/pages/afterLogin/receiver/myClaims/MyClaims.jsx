import { useState, useEffect, useRef } from 'react';
import "./MyClaims.css";
import ReceiverNavbar from "../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar";
import ReceiverFooter from "../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter";
import InTransitCard from "../../../../components/afterLogin/receiver/myClaims/InTransitCard";
import LookingForDriverCard from "../../../../components/afterLogin/receiver/myClaims/LookingForDriverCard";
import CompletedHistoryCard from "../../../../components/afterLogin/receiver/myClaims/CompletedHistoryCard";
import { getMyClaims } from '../../../../services/donationApi';

const Myclaims = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch claimed donations - only on initial load
    useEffect(() => {
        let isMounted = true;

        const fetchClaims = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('[MyClaims] Fetching my claims...');
                
                const response = await getMyClaims();
                
                if (!isMounted) return;
                
                if (response.success && response.donations) {
                    console.log(`[MyClaims] Loaded ${response.donations.length} claimed donations`);
                    setDonations(response.donations);
                } else {
                    setDonations([]);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error('[MyClaims] Error fetching claims:', err);
                setError(err.message || 'Failed to load your claims');
                setDonations([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // Initial fetch only
        fetchClaims();

        // Cleanup on unmount
        return () => {
            isMounted = false;
        };
    }, []); // Only run once on mount

    // Filter donations by status
    const lookingForDriver = donations.filter(d => d.status === 'assigned');
    const inTransit = donations.filter(d => d.status === 'picked_up');
    const completed = donations.filter(d => d.status === 'delivered');

    if (loading) {
        return (
            <>
                <ReceiverNavbar />
                <div className="myclaims-container">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '50vh',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div className="loading-spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #1b4332',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#1b4332', fontSize: '16px' }}>Loading your claims...</p>
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

    if (error) {
        return (
            <>
                <ReceiverNavbar />
                <div className="myclaims-container">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '50vh',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '20px'
                    }}>
                        <p style={{ color: '#d32f2f', fontSize: '16px', textAlign: 'center' }}>
                            ⚠️ {error}
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#1b4332',
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
                <ReceiverFooter />
            </>
        );
    }

    return (
        <>
            <ReceiverNavbar />
            <div className="myclaims-container">
                <div className="intransit">
                    <h2 className="active-donations">In Transit Donation </h2>
                    <div className="donation-cards">
                        {inTransit.length > 0 ? (
                            inTransit.map((donation) => (
                                <InTransitCard key={donation.id} donation={donation} />
                            ))
                        ) : (
                            <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                                No donations in transit
                            </p>
                        )}
                    </div>
                </div>
                <div className="looking">
                    <h2 className="active-donations">Looking for Driver </h2>
                    <div className="donation-cards">
                        {lookingForDriver.length > 0 ? (
                            lookingForDriver.map((donation) => (
                                <LookingForDriverCard key={donation.id} donation={donation} />
                            ))
                        ) : (
                            <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                                No donations waiting for driver
                            </p>
                        )}
                    </div>
                </div>
                <div className="complited">
                    <h2 className="active-donations" style={{ color: "darkgreen" }}>Completed History </h2>
                    <div className="donation-cards">
                        {completed.length > 0 ? (
                            completed.map((donation) => (
                                <CompletedHistoryCard key={donation.id} donation={donation} />
                            ))
                        ) : (
                            <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                                No completed donations
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <ReceiverFooter />
        </>
    );
};

export default Myclaims;


