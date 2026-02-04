import { useState, useEffect } from 'react';
import './ReceiverFindFood.css';
import Sidebar from '../../../../components/afterLogin/receiver/findFood/sideBar/SideBar';
import MapSection from '../../../../components/afterLogin/receiver/findFood/mapSection/MapSection';
import ReceiverNavbar from "../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar";
import ReceiverFooter from "../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter";
import { getAvailableDonations } from '../../../../services/donationApi';

const FindFood = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Format time ago
    const getTimeAgo = (date) => {
        if (!date) return 'Recently';
        const now = new Date();
        const donationDate = new Date(date);
        const diffInSeconds = Math.floor((now - donationDate) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds} sec${diffInSeconds !== 1 ? 's' : ''} ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min${Math.floor(diffInSeconds / 60) !== 1 ? 's' : ''} ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr${Math.floor(diffInSeconds / 3600) !== 1 ? 's' : ''} ago`;
        return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) !== 1 ? 's' : ''} ago`;
    };

    // Format expiry date
    const formatExpiryDate = (date) => {
        if (!date) return 'N/A';
        const expiryDate = new Date(date);
        const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
        const year = expiryDate.getFullYear();
        return `${month}/${year}`;
    };

    // Format quantity display
    const formatQuantity = (quantity) => {
        if (!quantity) return 'N/A';
        return `${quantity} ${quantity === 1 ? 'serving' : 'servings'} Available`;
    };

    // Fetch available donations
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('[ReceiverFindFood] Fetching available donations...');
                
                const response = await getAvailableDonations();
                
                if (response.success && response.donations) {
                    // Default coordinates (Sri Lanka center) for donations without geocoded addresses
                    const defaultCoordinates = [7.0873, 80.0144];
                    
                    // Transform donation data to match component structure
                    // Show ALL donations - use default coordinates if geocoding failed
                    const transformedItems = response.donations.map(donation => ({
                        id: donation.id,
                        trackingId: donation.trackingId,
                        title: donation.itemName,
                        listedTime: getTimeAgo(donation.createdAt),
                        expiry: formatExpiryDate(donation.expiryDate),
                        quantity: formatQuantity(donation.quantity),
                        impactPeople: donation.quantity || 0,
                        image: donation.imageUrl,
                        // Use provided coordinates or default to Sri Lanka center
                        position: donation.position && Array.isArray(donation.position) && donation.position.length === 2
                            ? donation.position
                            : defaultCoordinates,
                        hasValidCoordinates: !!(donation.position && Array.isArray(donation.position) && donation.position.length === 2),
                        // Additional data for tooltips and details
                        donation: donation, // Store full donation object
                        foodCategory: donation.foodCategory,
                        storageRecommendation: donation.storageRecommendation,
                        aiQualityScore: donation.aiQualityScore,
                        preferredPickupDate: donation.preferredPickupDate,
                        preferredPickupTimeFrom: donation.preferredPickupTimeFrom,
                        preferredPickupTimeTo: donation.preferredPickupTimeTo,
                        donorName: donation.donorName,
                        donorType: donation.donorType,
                        donorAddress: donation.donorAddress,
                    }));
                    
                    console.log(`[ReceiverFindFood] Loaded ${transformedItems.length} donations (${transformedItems.filter(item => item.hasValidCoordinates).length} with valid coordinates)`);
                    setItems(transformedItems);
                } else {
                    setItems([]);
                }
            } catch (err) {
                console.error('[ReceiverFindFood] Error fetching donations:', err);
                setError(err.message || 'Failed to load donations');
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    if (loading) {
        return (
            <>
                <ReceiverNavbar />
                <div className="find-food-page">
                    <div className="loading-container" style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100vh',
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
                        <p style={{ color: '#1b4332', fontSize: '16px' }}>Loading available donations...</p>
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
                <div className="find-food-page">
                    <div className="error-container" style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100vh',
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

    // Handle card click to center map on marker
    const handleCardClick = (item) => {
        if (item.position && window.mapInstance) {
            window.mapInstance.setView(item.position, 15, {
                animate: true,
                duration: 0.5
            });
        }
    };

    return (
        <>
            <ReceiverNavbar />
            <div className="find-food-page">
                <div className="sidebar-section">
                    <Sidebar items={items} onCardClick={handleCardClick} />
                </div>
                <div className="map-section">
                    <MapSection items={items} />
                </div>
            </div>
            <ReceiverFooter />
        </>
    );
};

export default FindFood;
