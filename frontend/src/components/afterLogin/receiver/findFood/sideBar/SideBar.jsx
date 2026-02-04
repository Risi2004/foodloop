import { useState, useMemo } from 'react';
import './SideBar.css';
import FoodCard from '../../../../../components/afterLogin/receiver/findFood/foodCard/FoodCard';

const Sidebar = ({ items, onCardClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);

    // Get unique categories and storage types
    const categories = useMemo(() => {
        const cats = [...new Set(items.map(item => item.foodCategory || item.donation?.foodCategory).filter(Boolean))];
        return cats;
    }, [items]);

    const storageTypes = useMemo(() => {
        const storages = [...new Set(items.map(item => item.storageRecommendation || item.donation?.storageRecommendation).filter(Boolean))];
        return storages;
    }, [items]);

    // Filter items based on search and filters
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const donation = item.donation || item;
            const title = (item.title || donation.itemName || '').toLowerCase();
            const category = item.foodCategory || donation.foodCategory || '';
            const storage = item.storageRecommendation || donation.storageRecommendation || '';

            // Search filter
            if (searchQuery && !title.includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category filter
            if (selectedCategory && category !== selectedCategory) {
                return false;
            }

            // Storage filter
            if (selectedStorage && storage !== selectedStorage) {
                return false;
            }

            return true;
        });
    }, [items, searchQuery, selectedCategory, selectedStorage]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    const handleStorageClick = (storage) => {
        setSelectedStorage(selectedStorage === storage ? null : storage);
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h1>Find Surplus Food</h1>

                <div className="search-bar-container">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Find Food" 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-chips">
                    {selectedCategory && (
                        <button 
                            className="chip active"
                            onClick={() => handleCategoryClick(selectedCategory)}
                        >
                            {selectedCategory} ✕
                        </button>
                    )}
                    {selectedStorage && (
                        <button 
                            className="chip active"
                            onClick={() => handleStorageClick(selectedStorage)}
                        >
                            {selectedStorage} ✕
                        </button>
                    )}
                    {categories.length > 0 && (
                        <div className="filter-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                            <button className="chip filter-btn">Filter ⚙️</button>
                            <div className="filter-menu" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '8px',
                                marginTop: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 1000,
                                minWidth: '150px',
                                display: 'none' // Will be shown on hover/click if needed
                            }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong style={{ fontSize: '12px', color: '#1b4332' }}>Category:</strong>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryClick(cat)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '4px 8px',
                                                margin: '2px 0',
                                                border: 'none',
                                                backgroundColor: selectedCategory === cat ? '#d4f8d4' : 'transparent',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <strong style={{ fontSize: '12px', color: '#1b4332' }}>Storage:</strong>
                                    {storageTypes.map(storage => (
                                        <button
                                            key={storage}
                                            onClick={() => handleStorageClick(storage)}
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '4px 8px',
                                                margin: '2px 0',
                                                border: 'none',
                                                backgroundColor: selectedStorage === storage ? '#d4f8d4' : 'transparent',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {storage}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginTop: '8px',
                    padding: '0 12px'
                }}>
                    {filteredItems.length} donation{filteredItems.length !== 1 ? 's' : ''} available
                </div>
            </div>

            <div className="food-list">
                {filteredItems.length === 0 ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        {items.length === 0 ? (
                            <>
                                <p style={{ fontSize: '16px', marginBottom: '8px' }}>No donations available</p>
                                <p style={{ fontSize: '12px' }}>Check back later for new food donations</p>
                            </>
                        ) : (
                            <>
                                <p style={{ fontSize: '16px', marginBottom: '8px' }}>No donations match your filters</p>
                                <p style={{ fontSize: '12px' }}>Try adjusting your search or filters</p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredItems.map((item, index) => (
                        <FoodCard 
                            key={item.id || index} 
                            item={item}
                            onCardClick={onCardClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;
