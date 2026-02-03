import { MapContainer, TileLayer, Marker, Popup, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSection.css';
import L from 'leaflet';

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

const MapSection = ({ items }) => {
    // Center roughly on Sri Lanka or based on Gampaha provided in text
    const position = [7.0873, 80.0144]; // Gampaha coordinates approx

    return (
        <div className="map-container-wrapper">
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="leaflet-map" zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {items.map((item, index) => (
                    <Marker
                        key={index}
                        position={item.position}
                        icon={createCustomIcon(item.image)}
                    >
                        <Popup>
                            <div className="popup-content">
                                <b>{item.title}</b><br />
                                {item.quantity} available
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Zoom Control at bottom right manually if needed, or stick to default positions. 
            The design shows simple + - buttons at bottom right. Leaflet has this by default top-left usually, 
            but we can move it. */}
            </MapContainer>

            <CurrentLocationOverlay />

            <div className="map-controls">
                <button className="control-btn">+</button>
                <button className="control-btn">-</button>
            </div>
        </div>
    );
};

export default MapSection;
