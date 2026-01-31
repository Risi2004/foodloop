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
                </div>
            </div >
            <DriverFooter />
        </>
    )
}

export default Pickup;