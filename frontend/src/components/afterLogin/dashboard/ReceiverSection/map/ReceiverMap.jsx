import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapReadyNotifier from '../../../RoleLayout/MapReadyNotifier';
import './ReceiverMap.css';
import { getMapLocations } from '../../../../../services/mapApi';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


const donorPinSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pin-inner-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

const donorIcon = L.divIcon({
    className: 'custom-pin',
    html: `<div class="pin-outer pin-pickup">${donorPinSvg}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const MapLegend = () => (
    <div className="donor-map__legend">
        <h4>Legend</h4>
        <div className="legend__item">
            <div className="legend__icon pickup">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <span>Donors</span>
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

// Default center (Colombo, Sri Lanka)
const DEFAULT_CENTER = [6.9271, 79.8612];

function DonorMap() {
    const [mapInstance, setMapInstance] = React.useState(null);
    const [donorLocations, setDonorLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        getMapLocations()
            .then((data) => {
                if (!cancelled && data.donors && Array.isArray(data.donors)) {
                    setDonorLocations(data.donors);
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || 'Failed to load donor locations');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

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
                <p>See our community in action. Green markers show donor locations in your area.</p>
            </div>
            <div className='donor-map__content'>
                <div className="donor-map__container">
                    {loading && (
                        <div className="donor-map__loading">Loading donor locations...</div>
                    )}
                    {error && (
                        <div className="donor-map__error">{error}</div>
                    )}
                    <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom={false} zoomControl={false}>
                        <MapReadyNotifier />
                        <MapController setMapInstance={setMapInstance} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {donorLocations.map((loc, idx) => (
                            <Marker
                                key={idx}
                                position={[loc.lat, loc.lng]}
                                icon={donorIcon}
                            >
                                <Popup>
                                    <strong>Donor</strong><br />
                                    {loc.displayName || 'Donor location'}
                                </Popup>
                            </Marker>
                        ))}
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