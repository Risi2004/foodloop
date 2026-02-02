import './Sidebar.css';
import FoodCard from '../FoodCard/FoodCard';

const Sidebar = ({ items }) => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h1>Find Surplus Food</h1>

                <div className="search-bar-container">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Find Food" className="search-input" />
                </div>

                <div className="filter-chips">
                    <button className="chip active">Near me ✕</button>
                    <button className="chip active">Near me ✕</button>
                    <button className="chip filter-btn">Filter ⚙️</button>
                </div>
            </div>

            <div className="food-list">
                {items.map((item, index) => (
                    <FoodCard key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
