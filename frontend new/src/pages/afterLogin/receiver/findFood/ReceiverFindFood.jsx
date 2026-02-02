import { useState } from 'react';
import './ReceiverFindFood.css';
import Sidebar from '../../../../components/afterLogin/receiver/findFood/sideBar/SideBar';
import MapSection from '../../../../components/afterLogin/receiver/findFood/mapSection/MapSection';

const FindFood = () => {
    // Mock Data
    const [items] = useState([
        {
            id: 1,
            title: "Bag of Fuji Apples",
            listedTime: "2 mins ago",
            expiry: "08/2026",
            quantity: "5kg Available",
            impactPeople: 12,
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Unsplash apple image
            position: [7.0873, 80.0144], // Center
        },
        {
            id: 2,
            title: "Bag of Fuji Apples",
            listedTime: "15 mins ago",
            expiry: "08/2026",
            quantity: "2kg Available",
            impactPeople: 5,
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            position: [7.0920, 80.0050], // NW
        },
        {
            id: 3,
            title: "Bag of Fuji Apples",
            listedTime: "1 hr ago",
            expiry: "08/2026",
            quantity: "10kg Available",
            impactPeople: 24,
            image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            position: [7.0800, 80.0200], // SE
        }
    ]);

    return (
        <div className="find-food-page">
            <div className="sidebar-section">
                <Sidebar items={items} />
            </div>
            <div className="map-section">
                <MapSection items={items} />
            </div>
        </div>
    );
};

export default FindFood;
