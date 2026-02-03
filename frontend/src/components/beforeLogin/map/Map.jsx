import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';


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
    const isPickup = type === 'pickup';


    const pickupSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-inner-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    const dropoffSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-inner-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;

    return L.divIcon({
        className: 'custom-pin',
        html: `<div class="pin-outer ${isPickup ? 'pin-pickup animate' : 'pin-dropoff'}">
                 ${isPickup ? pickupSvg : dropoffSvg}
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

const pickupIcon = createCustomIcon('pickup');
const dropoffIcon = createCustomIcon('dropoff');


const MapLegend = () => (
    <div className="map__legend">
        <h4>Map Legend</h4>
        <div className="legend__item">
            <div className="legend__icon pickup-marker">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <span>Active Pickups</span>
        </div>
        <div className="legend__item">
            <div className="legend__icon dropoff-marker">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <span>Drop-off Points</span>
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

function Map() {
    const [mapInstance, setMapInstance] = React.useState(null);

    const position = [6.9271, 79.8612];

    const handleZoomIn = () => {
        if (mapInstance) mapInstance.zoomIn();
    };

    const handleZoomOut = () => {
        if (mapInstance) mapInstance.zoomOut();
    };

    return (
        <div className="map">
            <div className='map__s1'>
                <h1>Live Impact Map</h1>
                <p>See our community in action. Green markers show active donations ready for pickup, and red markers show distribution centers feeding those in need.</p>
            </div>
            <div className='map__s2'>
                { }
                <div className="map__zoom-controls">
                    <button onClick={handleZoomIn} className="zoom-btn" aria-label="Zoom in">
                        +
                    </button>
                    <button onClick={handleZoomOut} className="zoom-btn" aria-label="Zoom out">
                        −
                    </button>
                </div>

                <div className="map__container">
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} zoomControl={false}>
                        <MapController setMapInstance={setMapInstance} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        { }
                        <Marker position={[6.9271, 79.8612]} icon={pickupIcon}>
                            <Popup>
                                <strong>Active Pickup</strong><br /> Fresh Vegetables available.
                            </Popup>
                        </Marker>
                        <Marker position={[6.935, 79.85]} icon={pickupIcon}>
                            <Popup>
                                <strong>Active Pickup</strong><br /> Bakery Surplus.
                            </Popup>
                        </Marker>

                        <Marker position={[6.90, 79.89]} icon={dropoffIcon}>
                            <Popup>
                                <strong>Drop-off Point</strong><br /> Community Center.
                            </Popup>
                        </Marker>
                        <Marker position={[6.8860, 79.9198]} icon={dropoffIcon}>
                            <Popup>
                                <strong>Drop-off Point</strong><br /> Kotte Distribution Hub.
                            </Popup>
                        </Marker>

                    </MapContainer>
                    <MapLegend />
                </div>
            </div>
        </div>
    )
}

export default Map;