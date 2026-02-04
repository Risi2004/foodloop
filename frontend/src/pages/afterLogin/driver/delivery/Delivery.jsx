import { useState, useEffect } from 'react';
import DriverNavbar from "../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar";
import DriverFooter from "../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter";
import DeliverCard from "../../../../components/afterLogin/driver/delivery/DeliveryCard";
import DeliveryMap from "../../../../components/afterLogin/driver/delivery/DeliveryMap";
import { getAvailablePickups } from '../../../../services/donationApi';
import { updateDriverLocation } from '../../../../services/api';
import { getAuthHeaders } from '../../../../utils/auth';
import './Delivery.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Delivery() {
    const [pickups, setPickups] = useState([]);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch available pickups and driver location
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('[Delivery] Fetching available pickups...');
                
                // Fetch pickups
                const response = await getAvailablePickups();
                
                if (response.success && response.pickups) {
                    console.log(`[Delivery] Loaded ${response.pickups.length} pickups`);
                    setPickups(response.pickups);
                    
                    // Set driver location from response
                    if (response.driverLocation) {
                        setDriverLocation(response.driverLocation);
                    }
                } else {
                    setPickups([]);
                }

                // Also fetch current user to get driver location if not in response
                if (!response.driverLocation) {
                    try {
                        const userResponse = await fetch(`${API_URL}/api/auth/verify`, {
                            method: 'GET',
                            headers: getAuthHeaders(),
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            if (userData.success && userData.user) {
                                const user = userData.user;
                                if (user.driverLatitude && user.driverLongitude) {
                                    setDriverLocation({
                                        latitude: user.driverLatitude,
                                        longitude: user.driverLongitude,
                                    });
                                }
                            }
                        }
                    } catch (userError) {
                        console.warn('[Delivery] Could not fetch user location:', userError);
                    }
                }
            } catch (err) {
                console.error('[Delivery] Error fetching data:', err);
                setError(err.message || 'Failed to load pickups');
                setPickups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePickupSelect = (pickup) => {
        setSelectedPickup(pickup);
    };

    const handleLocationUpdate = async (latitude, longitude) => {
        try {
            console.log('[Delivery] Updating driver location:', { latitude, longitude });
            
            const response = await updateDriverLocation(latitude, longitude);
            
            if (response.success && response.location) {
                setDriverLocation(response.location);
                console.log('[Delivery] Driver location updated successfully');
                
                // Refresh pickups to recalculate distances
                const pickupsResponse = await getAvailablePickups();
                if (pickupsResponse.success && pickupsResponse.pickups) {
                    setPickups(pickupsResponse.pickups);
                    
                    // Update selected pickup if one is selected
                    if (selectedPickup) {
                        const updatedPickup = pickupsResponse.pickups.find(p => p.id === selectedPickup.id);
                        if (updatedPickup) {
                            setSelectedPickup(updatedPickup);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('[Delivery] Error updating location:', err);
            throw err; // Re-throw to let LocationBox handle the error
        }
    };

    if (loading) {
        return (
            <>
                <DriverNavbar />
                <div className='delivery'>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '600px',
                        flexDirection: 'column',
                        gap: '16px',
                        width: '100%'
                    }}>
                        <div className="loading-spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #1F4E36',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#1F4E36', fontSize: '16px' }}>Loading available pickups...</p>
                    </div>
                </div>
                <DriverFooter />
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
                <DriverNavbar />
                <div className='delivery'>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '600px',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '20px',
                        width: '100%'
                    }}>
                        <p style={{ color: '#d32f2f', fontSize: '16px', textAlign: 'center' }}>
                            ⚠️ {error}
                        </p>
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
                <DriverFooter />
            </>
        );
    }

    return (
        <>
            <DriverNavbar />
            <div className='delivery'>
                <div className='delivery__s1'>
                    <div className='delivery__s1__info'>
                        <h1>Available List</h1>
                        <h5>{pickups.length} Pickup{pickups.length !== 1 ? 's' : ''} Found</h5>
                    </div>
                    {pickups.length === 0 ? (
                        <div style={{ 
                            padding: '40px 20px', 
                            textAlign: 'center', 
                            color: '#666' 
                        }}>
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No pickups available</p>
                            <p style={{ fontSize: '12px' }}>Check back later for new pickup requests</p>
                        </div>
                    ) : (
                        pickups.map((pickup) => (
                            <DeliverCard
                                key={pickup.id}
                                donation={pickup}
                                isSelected={selectedPickup?.id === pickup.id}
                                onClick={() => handlePickupSelect(pickup)}
                            />
                        ))
                    )}
                </div>
                <div className="delivery-map-section">
                    <DeliveryMap 
                        selectedPickup={selectedPickup}
                        driverLocation={driverLocation}
                        onLocationUpdate={handleLocationUpdate}
                    />
                </div>
            </div>
            <DriverFooter />
        </>
    )
}

export default Delivery; 