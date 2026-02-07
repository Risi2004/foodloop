import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapReadyNotifier from '../../../RoleLayout/MapReadyNotifier';
import './DonorMap.css';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


const createCustomIcon = (type) => {
    // We only use pickup SVG but want it red
    const pickupSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-inner-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

    // For this specific request, we want the pickup shape (circle) but RED color.
    // 'pin-pickup-red' is defined in CSS to be red (#E74C3C)

    return L.divIcon({
        className: 'custom-pin',
        html: `<div class="pin-outer pin-pickup-red animate">
                 ${pickupSvg}
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

const redPickupIcon = createCustomIcon('pickup-red');


const MapLegend = () => (
    <div className="donor-map__legend">
        <h4>Map Legend</h4>
        <div className="legend__item">
            <div className="legend__icon pickup-red">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <span>Pick up Points</span>
        </div>
    </div>
);


const MapController = ({ setMapInstance }) => {
    const map = useMap();
    React.useEffect(() => {
        setMapInstance(map);
    }, [map, setMapInstance]);
    return null;
};

function DonorMap() {
    const [mapInstance, setMapInstance] = React.useState(null);

    // Center based on the markers we are showing
    const position = [6.9271, 79.8612];

    const handleZoomIn = () => {
        if (mapInstance) mapInstance.zoomIn();
    };

    const handleZoomOut = () => {
        if (mapInstance) mapInstance.zoomOut();
    };

    return (
        <div className="donor-map">
            <div className='donor-map__header'>
                <h1>Live Impact Map</h1>
                <p>See our community in action. Red markers show active donations ready for pickup in your area.</p>
            </div>
            <div className='donor-map__content'>
                <div className="donor-map__container">
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} zoomControl={false}>
                        <MapReadyNotifier />
                        <MapController setMapInstance={setMapInstance} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Showing only Active Pickups, but with RED styling as requested */}
                        <Marker position={[6.9271, 79.8612]} icon={redPickupIcon}>
                            <Popup>
                                <strong>Pick up Point</strong><br /> Fresh Vegetables available.
                            </Popup>
                        </Marker>
                        <Marker position={[6.935, 79.85]} icon={redPickupIcon}>
                            <Popup>
                                <strong>Pick up Point</strong><br /> Bakery Surplus.
                            </Popup>
                        </Marker>

                    </MapContainer>
                    <div className="donor-map__zoom-controls">
                        <button onClick={handleZoomIn} className="zoom-btn" aria-label="Zoom in">
                            +
                        </button>
                        <button onClick={handleZoomOut} className="zoom-btn" aria-label="Zoom out">
                            −
                        </button>
                    </div>
                    <MapLegend />
                </div>
            </div>
        </div>
    )
}

export default DonorMap;