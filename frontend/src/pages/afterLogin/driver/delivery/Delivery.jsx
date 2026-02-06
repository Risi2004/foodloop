import { useState, useEffect } from 'react';
import DriverNavbar from "../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar";
import DriverFooter from "../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter";
import DeliverCard from "../../../../components/afterLogin/driver/delivery/DeliveryCard";
import DeliveryMap from "../../../../components/afterLogin/driver/delivery/DeliveryMap";
import { getAvailablePickups, getActiveDeliveries, acceptOrder } from '../../../../services/donationApi';
import { updateDriverLocation } from '../../../../services/api';
import { getAuthHeaders } from '../../../../utils/auth';
import { useNavigate } from 'react-router-dom';
import './Delivery.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Delivery() {
    const navigate = useNavigate();
    const [pickups, setPickups] = useState([]);
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acceptingOrderId, setAcceptingOrderId] = useState(null);

    // Fetch available pickups, active deliveries, and driver location
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('[Delivery] Fetching available pickups and active deliveries...');
                
                // Fetch pickups and active deliveries in parallel
                const [pickupsResponse, deliveriesResponse] = await Promise.all([
                    getAvailablePickups(),
                    getActiveDeliveries()
                ]);
                
                if (pickupsResponse && pickupsResponse.success && pickupsResponse.pickups) {
                    console.log(`[Delivery] Loaded ${pickupsResponse.pickups.length} pickups`);
                    setPickups(pickupsResponse.pickups);
                    
                    // Set driver location from response
                    if (pickupsResponse.driverLocation) {
                        setDriverLocation(pickupsResponse.driverLocation);
                    }
                } else {
                    setPickups([]);
                }

                if (deliveriesResponse && deliveriesResponse.success && deliveriesResponse.deliveries) {
                    console.log(`[Delivery] Loaded ${deliveriesResponse.deliveries.length} active deliveries`);
                    setActiveDeliveries(deliveriesResponse.deliveries);
                    
                    // Set driver location from deliveries response if not already set
                    if (!driverLocation && deliveriesResponse.driverLocation) {
                        setDriverLocation(deliveriesResponse.driverLocation);
                    }
                } else {
                    setActiveDeliveries([]);
                }

                // Also fetch current user to get driver location if not in response
                const hasDriverLocation = driverLocation || 
                    (pickupsResponse && pickupsResponse.driverLocation) || 
                    (deliveriesResponse && deliveriesResponse.driverLocation);
                
                if (!hasDriverLocation) {
                    try {
                        const userResponse = await fetch(`${API_URL}/api/auth/verify`, {
                            method: 'GET',
                            headers: getAuthHeaders(),
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            if (userData && userData.success && userData.user) {
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
                        // Don't set error state for this, it's optional
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

    const handleAcceptOrder = async (pickup) => {
        if (!pickup?.id) return;
        setAcceptingOrderId(pickup.id);
        try {
            await acceptOrder(pickup.id);
            navigate(`/driver/pickup?donationId=${pickup.id}`);
        } catch (err) {
            alert(err.message || 'Failed to accept order. Please try again.');
        } finally {
            setAcceptingOrderId(null);
        }
    };

    const handleDeliverySelect = (delivery) => {
        // Navigate to delivery confirmation page
        navigate(`/driver/delivery-confirmation?donationId=${delivery.id}`);
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
                    {/* In Transit Pickups - orders this driver has confirmed pickup for */}
                    {activeDeliveries.length > 0 && (
                        <>
                            <div className='delivery__s1__info'>
                                <h1>In Transit Pickups</h1>
                                <h5>{activeDeliveries.length} Pickup{activeDeliveries.length !== 1 ? 's' : ''} In Transit</h5>
                            </div>
                            {activeDeliveries.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    onClick={() => handleDeliverySelect(delivery)}
                                    style={{
                                        padding: '16px',
                                        background: 'white',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        cursor: 'pointer',
                                        border: '2px solid #10b981',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 8px 0', color: '#1F4E36' }}>{delivery.itemName}</h3>
                                            <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                                                To: {delivery.receiverName}
                                            </p>
                                            <p style={{ margin: '0', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>
                                                {delivery.driverToReceiverDistanceFormatted || 'Calculating distance...'}
                                            </p>
                                        </div>
                                        <button
                                            style={{
                                                padding: '10px 20px',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Confirm Delivery
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Available Pickups Section */}
                    <div className='delivery__s1__info' style={{ marginTop: activeDeliveries.length > 0 ? '30px' : '0' }}>
                        <h1>Available Pickups</h1>
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
                                onAcceptOrder={handleAcceptOrder}
                                isAccepting={acceptingOrderId === pickup.id}
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