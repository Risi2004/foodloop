import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSection.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icon function to match the design (Image inside a pin)
const createCustomIcon = (imageUrl) => {
    return L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="marker-pin"><img src="${imageUrl}" class="marker-img" /></div>`,
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60]
    });
};

// Component to center map on all markers
const MapController = ({ items }) => {
    const map = useMap();
    
    useEffect(() => {
        if (items.length > 0) {
            const positions = items
                .filter(item => item.position && Array.isArray(item.position) && item.position.length === 2)
                .map(item => item.position);
            
            if (positions.length > 0) {
                const bounds = L.latLngBounds(positions);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } else {
            // Default to Sri Lanka if no items
            map.setView([7.0873, 80.0144], 8);
        }
    }, [map, items]);
    
    return null;
};

// Current Location Component
const CurrentLocationOverlay = () => {
    return (
        <div className="current-location-overlay">
            <div className="location-icon">📍</div>
            <div className="location-text">
                <span className="label">Current Location</span>
                <span className="value">Gampaha, Sri Lanka</span>
            </div>
        </div>
    );
};

// Format date for display
const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format expiry date for display
const formatExpiryDate = (date) => {
    if (!date) return 'N/A';
    const expiryDate = new Date(date);
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expiryDate.getFullYear();
    return `${month}/${year}`;
};

// Format time for display
const formatTime = (time) => {
    if (!time) return 'N/A';
    return time;
};

const MapSection = ({ items }) => {
    // Default center (Sri Lanka)
    const defaultPosition = [7.0873, 80.0144];
    
    // Calculate center based on items if available
    const calculateCenter = () => {
        if (items.length === 0) return defaultPosition;
        
        const validPositions = items
            .filter(item => item.position && Array.isArray(item.position) && item.position.length === 2)
            .map(item => item.position);
        
        if (validPositions.length === 0) return defaultPosition;
        
        const avgLat = validPositions.reduce((sum, pos) => sum + pos[0], 0) / validPositions.length;
        const avgLng = validPositions.reduce((sum, pos) => sum + pos[1], 0) / validPositions.length;
        
        return [avgLat, avgLng];
    };

    const center = calculateCenter();
    const zoom = items.length > 1 ? 10 : 13;

    return (
        <div className="map-container-wrapper">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="leaflet-map" zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapController items={items} />
                <ZoomButtons />

                {items.map((item, index) => {
                    // Show all items - position should always be set (default if geocoding failed)
                    if (!item.position || !Array.isArray(item.position) || item.position.length !== 2) {
                        console.warn(`[MapSection] Item ${item.id} has invalid position, skipping marker`);
                        return null;
                    }
                    
                    const donation = item.donation || item;
                    
                    return (
                        <Marker
                            key={item.id || index}
                            position={item.position}
                            icon={createCustomIcon(item.image || '/placeholder-food.jpg')}
                        >
                            <Tooltip permanent={false} direction="top" offset={[0, -60]}>
                                <div className="tooltip-content" style={{
                                    minWidth: '200px',
                                    padding: '8px',
                                    fontSize: '12px',
                                    lineHeight: '1.4'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1b4332', fontSize: '13px' }}>
                                        {item.title || donation.itemName || 'Food Item'}
                                    </div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <strong>Quantity:</strong> {item.quantity || donation.quantity || 'N/A'}
                                    </div>
                                    <div style={{ marginBottom: '2px' }}>
                                        <strong>Expiry:</strong> {item.expiry || formatExpiryDate(donation.expiryDate) || 'N/A'}
                                    </div>
                                    {donation.donorName && (
                                        <div style={{ marginBottom: '2px' }}>
                                            <strong>Donor:</strong> {donation.donorName}
                                        </div>
                                    )}
                                    {donation.donorAddress && (
                                        <div style={{ marginBottom: '2px', fontSize: '11px', color: '#666' }}>
                                            📍 {donation.donorAddress}
                                        </div>
                                    )}
                                    {donation.preferredPickupDate && (
                                        <div style={{ marginBottom: '2px' }}>
                                            <strong>Pickup:</strong> {formatDate(donation.preferredPickupDate)}
                                        </div>
                                    )}
                                    {donation.preferredPickupTimeFrom && donation.preferredPickupTimeTo && (
                                        <div style={{ marginBottom: '2px' }}>
                                            <strong>Time:</strong> {formatTime(donation.preferredPickupTimeFrom)} - {formatTime(donation.preferredPickupTimeTo)}
                                        </div>
                                    )}
                                    {donation.storageRecommendation && (
                                        <div>
                                            <strong>Storage:</strong> {donation.storageRecommendation}
                                        </div>
                                    )}
                                    {!item.hasValidCoordinates && (
                                        <div style={{ marginTop: '4px', fontSize: '10px', color: '#ff9800', fontStyle: 'italic' }}>
                                            ⚠️ Approximate location
                                        </div>
                                    )}
                                </div>
                            </Tooltip>
                        </Marker>
                    );
                })}
            </MapContainer>

            <CurrentLocationOverlay />
        </div>
    );
};

// Zoom buttons component (must be inside MapContainer to use useMap)
const ZoomButtons = () => {
    const map = useMap();

    const handleZoomIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        map.zoomIn();
    };

    const handleZoomOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        map.zoomOut();
    };

    return (
        <div 
            className="map-controls" 
            style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                className="control-btn" 
                onClick={handleZoomIn}
                type="button"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                +
            </button>
            <button 
                className="control-btn" 
                onClick={handleZoomOut}
                type="button"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                -
            </button>
        </div>
    );
};

export default MapSection;
