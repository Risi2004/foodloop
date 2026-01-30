import DriverNavbar from "../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar";
import DriverFooter from "../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter";
import DeliverCard from "../../../../components/afterLogin/driver/delivery/DeliveryCard";
import DeliveryMap from "../../../../components/afterLogin/driver/delivery/DeliveryMap"; // Import the map component
import './Delivery.css';

import { useState } from 'react';

function Delivery() {
    const [selectedCard, setSelectedCard] = useState(null);

    return (
        <>
            <DriverNavbar />
            <div className='delivery'>
                <div className='delivery__s1'>
                    <div className='delivery__s1__info'>
                        <h1>Available List</h1>
                        <h5>12 Pickups Found</h5>
                    </div>
                    {[0, 1, 2, 3].map((index) => (
                        <DeliverCard
                            key={index}
                            isSelected={selectedCard === index}
                            onClick={() => setSelectedCard(index)}
                        />
                    ))}
                </div>
                <div className="delivery-map-section">
                    <DeliveryMap />
                </div>
            </div>
            <DriverFooter />
        </>
    )
}

export default Delivery; 