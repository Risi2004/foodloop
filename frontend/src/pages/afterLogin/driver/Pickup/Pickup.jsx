import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DriverNavbar from "../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar";
import DriverFooter from "../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter";
import './Pickup.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import DriverDetails from "../../../../components/afterLogin/driver/pickup/driverDetails/DriverDetails";
import Food from "../../../../components/afterLogin/driver/pickup/Food/Food";
import LiveJourney from "../../../../components/afterLogin/driver/pickup/liveJourney/LiveJourney";
import { confirmPickup } from '../../../../services/donationApi';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const mobileBlueOptions = { color: '#3b82f6', weight: 6, opacity: 0.8 };

const ZoomHandler = () => {
    const map = useMap();
    return (
        <div className="custom-zoom-controls">
            <button className="zoom-btn zoom-in" onClick={() => map.zoomIn()}>+</button>
            <button className="zoom-btn zoom-out" onClick={() => map.zoomOut()}>-</button>
        </div>
    )
}

function Pickup() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const donationId = searchParams.get('donationId');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const pickupLocation = [6.868, 79.918];
    const dropoffLocation = [6.850, 79.930];
    const currentLocation = [6.860, 79.925];

    const routePath = [
        pickupLocation,
        [6.865, 79.920],
        currentLocation,
        [6.855, 79.928],
        dropoffLocation
    ];

    const handleConfirmPickup = async () => {
        if (!donationId) {
            alert('Donation ID is missing');
            return;
        }

        if (isConfirmed) {
            alert('Pickup already confirmed');
            return;
        }

        setIsConfirming(true);
        try {
            const response = await confirmPickup(donationId);
            if (response.success) {
                setIsConfirmed(true);
                alert('Pickup confirmed! Emails have been sent to donor and receiver.');
                // Optionally redirect after a delay
                setTimeout(() => {
                    navigate('/driver/delivery');
                }, 2000);
            } else {
                alert(response.message || 'Failed to confirm pickup');
            }
        } catch (error) {
            console.error('Error confirming pickup:', error);
            alert(error.response?.data?.message || error.message || 'Failed to confirm pickup. Please try again.');
        } finally {
            setIsConfirming(false);
        }
    };

    // Check if donationId is provided
    useEffect(() => {
        if (!donationId) {
            alert('No donation ID provided');
            navigate('/driver/delivery');
        }
    }, [donationId, navigate]);

    return (
        <>
            <DriverNavbar />
            <div className='pickup'>
                <div className='pickup__s1'>
                    <MapContainer
                        center={currentLocation}
                        zoom={14}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={pickupLocation}>
                            <Popup>Pickup Location</Popup>
                        </Marker>
                        <Marker position={dropoffLocation}>
                            <Popup>Dropoff Location</Popup>
                        </Marker>
                        <Marker position={currentLocation}>
                            <Popup>Driver Location</Popup>
                        </Marker>
                        <Polyline pathOptions={mobileBlueOptions} positions={routePath} />
                        <ZoomHandler />
                    </MapContainer>
                </div>
                <div className='pickup__s2'>
                    <DriverDetails />
                    <Food />
                    <LiveJourney />
                    <div style={{ 
                        padding: '20px', 
                        background: 'white', 
                        borderRadius: '12px', 
                        marginTop: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        {isConfirmed ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ 
                                    color: '#10b981', 
                                    fontSize: '18px', 
                                    fontWeight: 'bold',
                                    marginBottom: '10px'
                                }}>
                                    ✓ Pickup Confirmed!
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                    Emails have been sent to the donor and receiver. Redirecting...
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleConfirmPickup}
                                disabled={isConfirming || !donationId}
                                style={{
                                    width: '100%',
                                    padding: '14px 24px',
                                    background: isConfirming ? '#9ca3af' : 'linear-gradient(135deg, #1F4E36 0%, #2d5a3d 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: isConfirming || !donationId ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            >
                                {isConfirming ? 'Confirming Pickup...' : 'Confirm Pickup'}
                            </button>
                        )}
                    </div>
                </div>
            </div >
            <DriverFooter />
        </>
    )
}

export default Pickup;