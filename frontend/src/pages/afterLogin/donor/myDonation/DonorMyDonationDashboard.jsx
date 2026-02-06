import { useState, useEffect } from 'react';
import "./DonorMyDonationDashboard.css";
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection/navbar/DonorNavbar";
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter";
import DonationSidebar from "../../../../components/afterLogin/donor/myDonation/DonationSidebar";
import InTransitCard from "../../../../components/afterLogin/donor/myDonation/InTransitCard";
import LookingForDriverCard from "../../../../components/afterLogin/donor/myDonation/LookingForDriverCard";
import CompletedHistoryCard from "../../../../components/afterLogin/donor/myDonation/CompletedHistoryCard";
import { getMyDonations } from '../../../../services/donationApi';

const DonorMyDonationDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [impactStats, setImpactStats] = useState({
        mealsShared: 0,
        foodSaved: 0,
        co2Offset: 0
    });

    // Fetch donor's donations
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('[DonorMyDonationDashboard] Fetching my donations...');
                
                const response = await getMyDonations();
                
                if (response.success && response.donations) {
                    console.log(`[DonorMyDonationDashboard] Loaded ${response.donations.length} donations`);
                    setDonations(response.donations);
                    
                    // Calculate impact statistics
                    const completedDonations = response.donations.filter(d => d.status === 'delivered');
                    const totalMeals = completedDonations.reduce((sum, d) => sum + (d.quantity || 0), 0);
                    const totalFoodSaved = totalMeals * 0.6; // Estimate: ~0.6kg per meal
                    const totalCo2Offset = totalFoodSaved * 2.5; // Estimate: ~2.5kg CO2 per kg food saved
                    
                    setImpactStats({
                        mealsShared: totalMeals,
                        foodSaved: Math.round(totalFoodSaved),
                        co2Offset: Math.round(totalCo2Offset)
                    });
                } else {
                    setDonations([]);
                }
            } catch (err) {
                console.error('[DonorMyDonationDashboard] Error fetching donations:', err);
                setError(err.message || 'Failed to load your donations');
                setDonations([]);
            } finally {
                setLoading(false);
            }
        };

        // Load once when user comes to the page; reload only on manual refresh
        fetchDonations();
    }, []);

    // After receiver claims: show in Looking for Driver; only after driver accepts, show in In Transit
    const lookingForDriver = donations.filter(d =>
        d.status === 'pending' || d.status === 'approved' || (d.status === 'assigned' && !d.assignedDriverId)
    );
    const inTransit = donations.filter(d =>
        (d.status === 'assigned' && d.assignedDriverId) || d.status === 'picked_up'
    );
    const completed = donations.filter(d => d.status === 'delivered');

    // Handle edit donation (placeholder - can be implemented later)
    const handleEdit = (donation) => {
        console.log('Edit donation:', donation);
        // TODO: Navigate to edit page or open edit modal
    };

    // Handle delete donation (placeholder - can be implemented later)
    const handleDelete = (donation) => {
        console.log('Delete donation:', donation);
        // TODO: Show confirmation dialog and delete donation
        if (window.confirm('Are you sure you want to delete this donation?')) {
            // TODO: Call delete API
        }
    };

    if (loading) {
        return (
            <>
                <DonorNavbar />
                <div className="donor-my-donation-container">
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
                        <p style={{ color: '#1b4332', fontSize: '16px' }}>Loading your donations...</p>
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

    if (error) {
        return (
            <>
                <DonorNavbar />
                <div className="donor-my-donation-container">
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
                <DonorFooter />
            </>
        );
    }

    return (
        <>
            <DonorNavbar />
            <div className="donor-my-donation-container">
                <div className="donor-my-donation-layout">
                    <DonationSidebar impactStats={impactStats} />
                    
                    <main className="donor-my-donation-content">
                        <div className="intransit">
                            <h2 className="active-donations">In Transit Donations</h2>
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
                            <h2 className="active-donations">Looking for Driver</h2>
                            <div className="donation-cards">
                                {lookingForDriver.length > 0 ? (
                                    lookingForDriver.map((donation) => (
                                        <LookingForDriverCard 
                                            key={donation.id} 
                                            donation={donation}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))
                                ) : (
                                    <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                                        No donations waiting for driver
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="complited">
                            <h2 className="active-donations" style={{ color: "darkgreen" }}>Completed History</h2>
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
                    </main>
                </div>
            </div>
            <DonorFooter />
        </>
    );
};

export default DonorMyDonationDashboard;
