import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMapModal.css';

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

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
};

// Component to center map on coordinates
const MapCenterController = ({ center, zoom }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [map, center, zoom]);
    
    return null;
};

const LocationMapModal = ({ isOpen, onClose, onConfirm, defaultAddress, defaultLat, defaultLng, title = 'Confirm Pickup Location' }) => {
    const [coordinates, setCoordinates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(defaultAddress || '');
    const [markerPosition, setMarkerPosition] = useState(null);
    const markerRef = useRef(null);

    // Default center (Sri Lanka)
    const defaultCenter = [7.0873, 80.0144];
    const defaultZoom = 13;

    // Geocode address on mount or when address changes; or use defaultLat/defaultLng when provided (edit mode)
    useEffect(() => {
        if (!isOpen) return;

        if (defaultLat != null && defaultLng != null && !isNaN(defaultLat) && !isNaN(defaultLng)) {
            const coords = [Number(defaultLat), Number(defaultLng)];
            setCoordinates(coords);
            setMarkerPosition(coords);
            setLoading(false);
            setError(null);
            return;
        }

        const geocodeAddress = async (address) => {
            if (!address || address.trim() === '') {
                setError('No address provided');
                setLoading(false);
                setCoordinates(defaultCenter);
                setMarkerPosition(defaultCenter);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Format address for better geocoding
                let searchAddress = address.trim();
                const addressLower = searchAddress.toLowerCase();
                
                // Add Colombo for Wellawatte and other Colombo suburbs
                if (addressLower.includes('wellawatte') || 
                    addressLower.includes('wellawatta') ||
                    addressLower.includes('colombo')) {
                    if (!addressLower.includes('colombo') && !addressLower.includes('sri lanka')) {
                        searchAddress = `${searchAddress}, Colombo, Sri Lanka`;
                    } else if (!addressLower.includes('sri lanka')) {
                        searchAddress = `${searchAddress}, Sri Lanka`;
                    }
                } else if (!addressLower.includes('sri lanka') && !addressLower.includes('lanka')) {
                    searchAddress = `${searchAddress}, Sri Lanka`;
                }

                const encodedAddress = encodeURIComponent(searchAddress);
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&countrycodes=lk&limit=1&addressdetails=1`;

                // Add delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'FoodLoop-App/1.0',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Geocoding failed: ${response.status}`);
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    throw new Error('Address not found. Please adjust the location manually.');
                }

                const result = data[0];
                const coords = [parseFloat(result.lat), parseFloat(result.lon)];

                // Validate coordinates are within Sri Lanka bounds
                if (coords[0] < 5 || coords[0] > 10 || coords[1] < 79 || coords[1] > 82) {
                    console.warn('Coordinates outside Sri Lanka bounds, using default');
                    setCoordinates(defaultCenter);
                    setMarkerPosition(defaultCenter);
                    setError('Could not find exact location. Please adjust manually.');
                } else {
                    setCoordinates(coords);
                    setMarkerPosition(coords);
                    setCurrentAddress(result.display_name || address);
                }
            } catch (err) {
                console.error('Geocoding error:', err);
                setError(err.message || 'Failed to geocode address. Please adjust the location manually.');
                setCoordinates(defaultCenter);
                setMarkerPosition(defaultCenter);
            } finally {
                setLoading(false);
            }
        };

        geocodeAddress(defaultAddress);
    }, [isOpen, defaultAddress, defaultLat, defaultLng]);

    // Handle marker drag end
    const handleMarkerDragEnd = (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        const newCoords = [position.lat, position.lng];
        setMarkerPosition(newCoords);
        setCoordinates(newCoords);
        
        // Optional: Reverse geocode to update address display
        reverseGeocode(newCoords);
    };

    // Handle map click
    const handleMapClick = (latlng) => {
        const newCoords = [latlng.lat, latlng.lng];
        setMarkerPosition(newCoords);
        setCoordinates(newCoords);
        
        // Optional: Reverse geocode to update address display
        reverseGeocode(newCoords);
    };

    // Reverse geocode coordinates to get address
    const reverseGeocode = async (coords) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&zoom=18&addressdetails=1`;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'FoodLoop-App/1.0',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.display_name) {
                    setCurrentAddress(data.display_name);
                }
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err);
            // Don't show error to user, just keep current address
        }
    };

    // Handle confirm
    const handleConfirm = () => {
        if (!coordinates) {
            setError('Please select a location on the map');
            return;
        }

        // Validate coordinates are within Sri Lanka bounds
        if (coordinates[0] < 5 || coordinates[0] > 10 || coordinates[1] < 79 || coordinates[1] > 82) {
            setError('Selected location is outside Sri Lanka. Please select a valid location.');
            return;
        }

        onConfirm(coordinates[0], coordinates[1], currentAddress);
    };

    // Handle cancel
    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    const center = coordinates || defaultCenter;
    const zoom = coordinates ? 15 : defaultZoom;

    return (
        <div className="location-map-modal-overlay" onClick={handleCancel}>
            <div className="location-map-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="location-map-modal-header">
                    <h2>{title}</h2>
                    <button className="location-map-modal-close" onClick={handleCancel}>×</button>
                </div>

                <div className="location-map-modal-body">
                    <div className="location-map-address-display">
                        <strong>Address:</strong> {currentAddress || defaultAddress || 'Loading...'}
                    </div>

                    {error && (
                        <div className="location-map-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {loading && (
                        <div className="location-map-loading">
                            <div className="spinner"></div>
                            <p>Finding your location...</p>
                        </div>
                    )}

                    <div className="location-map-container">
                        {!loading && (
                            <MapContainer
                                center={center}
                                zoom={zoom}
                                scrollWheelZoom={true}
                                className="location-map"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapCenterController center={center} zoom={zoom} />
                                <MapClickHandler onMapClick={handleMapClick} />
                                
                                {markerPosition && (
                                    <Marker
                                        position={markerPosition}
                                        draggable={true}
                                        eventHandlers={{
                                            dragend: handleMarkerDragEnd,
                                        }}
                                        ref={markerRef}
                                    />
                                )}
                            </MapContainer>
                        )}
                    </div>

                    <div className="location-map-instructions">
                        <p>📍 Drag the marker or click on the map to adjust the pickup location</p>
                    </div>
                </div>

                <div className="location-map-modal-footer">
                    <button className="location-map-btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button 
                        className="location-map-btn-confirm" 
                        onClick={handleConfirm}
                        disabled={!coordinates || loading}
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationMapModal;
