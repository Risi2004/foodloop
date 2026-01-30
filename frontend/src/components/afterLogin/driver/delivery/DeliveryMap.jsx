import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './DeliveryMap.css';

// Custom Icons
const createCustomIcon = (color, type) => {
    let svgContent = '';

    // Simple SVG icons
    if (type === 'driver') {
        svgContent = `<svg viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>`;
    } else if (type === 'pickup') {
        svgContent = `<svg viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    } else if (type === 'drop') {
        svgContent = `<svg viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    } else if (type === 'truck') {
        svgContent = `<svg viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
    }

    return L.divIcon({
        className: 'custom-map-icon',
        html: `<div class="marker-pin" style="background-color: ${color}; box-shadow: 0 0 10px ${color}80;">
                 ${svgContent}
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

const driverIcon = createCustomIcon('#4CAF50', 'driver'); // Green
const truckIcon = createCustomIcon('#2196F3', 'truck');   // Blue
const dropIcon = createCustomIcon('#F44336', 'drop');     // Red

const LocationBox = () => {
    return (
        <div className="location-box">
            <div className="location-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1F4E36" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
                <p className="location-label">Current Location</p>
                <p className="location-name">Gampaha, Sri Lanka</p>
            </div>
        </div>
    );
};

// Component to handle map view bounds
const MapController = ({ bounds }) => {
    const map = useMap();
    React.useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, bounds]);
    return null;
};

// Wrap Zoom Buttons to access map context and stop propagation
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
            className="custom-zoom-buttons"
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()} // Stop bubbling to map
        >
            <button onClick={handleZoomIn} type="button">+</button>
            <button onClick={handleZoomOut} type="button">-</button>
        </div>
    );
};

function DeliveryMap() {
    // Coordinates
    const driverPos = [7.0873, 80.0144];
    const truckPos = [7.095, 80.025];
    const dropPos = [7.050, 80.000];

    const bounds = L.latLngBounds([driverPos, truckPos, dropPos]);

    return (
        <div className="delivery-map-container">
            <LocationBox />

            <MapContainer
                center={driverPos}
                zoom={13}
                className="leaflet-map"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController bounds={bounds} />

                <Marker position={driverPos} icon={driverIcon}><Popup>Current Location</Popup></Marker>
                <Marker position={truckPos} icon={truckIcon}><Popup>Vehicle</Popup></Marker>
                <Marker position={dropPos} icon={dropIcon}><Popup>Drop Location</Popup></Marker>

                <Polyline positions={[driverPos, truckPos]} color="#4CAF50" weight={5} />
                <Polyline positions={[truckPos, dropPos]} color="#2196F3" weight={5} />

                <ZoomButtons />
            </MapContainer>
        </div>
    );
}

export default DeliveryMap;
