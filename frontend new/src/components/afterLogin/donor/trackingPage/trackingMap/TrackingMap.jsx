import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './TrackingMap.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const startIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: #4CAF50; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const endIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: #F44336; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const driverIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="width: 40px; height: 40px; background: #2196F3; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; border: 3px solid white; box-shadow: 0 4px 10px rgba(33, 150, 243, 0.3);">🚌</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

function TrackingMap() {
    // Approximate coordinates for the locations
    const startPos = [6.865, 79.930]; // Thalapathpitiya
    const driverPos = [6.855, 79.928]; // Pamunuwa
    const endPos = [6.848, 79.926];   // Maharagama

    const polyline = [startPos, [6.860, 79.929], driverPos, [6.852, 79.927], endPos];

    return (
        <div className="tracking-map-container">
            <MapContainer
                center={driverPos}
                zoom={14}
                scrollWheelZoom={true}
                className="map-container"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route Line */}
                <Polyline
                    positions={polyline}
                    pathOptions={{ color: '#2196f3', weight: 4, dashArray: '10, 10', opacity: 0.7 }}
                />

                {/* Start Marker */}
                <Marker position={startPos} icon={startIcon}>
                    <Popup className="custom-popup">Thalapathpitiya</Popup>
                </Marker>

                {/* Driver Marker */}
                <Marker position={driverPos} icon={driverIcon}>
                    <Popup>Current Location: Pamunuwa</Popup>
                </Marker>

                {/* End Marker */}
                <Marker position={endPos} icon={endIcon}>
                    <Popup>Maharagama</Popup>
                </Marker>

                <ZoomControl />
            </MapContainer>
        </div>
    );
}

// Custom Zoom Control to match design
function ZoomControl() {
    const map = useMap();

    return (
        <div className="map-controls">
            <button className="map-control-btn" onClick={() => map.zoomIn()}>+</button>
            <button className="map-control-btn" onClick={() => map.zoomOut()}>-</button>
        </div>
    );
}

export default TrackingMap;
