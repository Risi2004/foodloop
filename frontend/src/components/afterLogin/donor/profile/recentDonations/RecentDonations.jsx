import './RecentDonations.css';

function RecentDonations() {
    const donations = [
        { item: 'Organic Apples', date: 'Oct 24, 2023', quantity: '2KG', status: 'Completed' },
        { item: 'Artisan Sourdough', date: 'Oct 24, 2023', quantity: '12KG', status: 'In Transit' },
        { item: 'Mixed Leaf Salad', date: 'Oct 24, 2023', quantity: '5KG', status: 'In Transit' },
        { item: 'Fresh Carrots', date: 'Oct 24, 2023', quantity: '3KG', status: 'Pending' },
        { item: 'Organic Apples', date: 'Oct 24, 2023', quantity: '6KG', status: 'Completed' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'In Transit': return 'status-transit';
            case 'Pending': return 'status-pending';
            default: return '';
        }
    };

    return (
        <div className="recent-donations-section">
            <div className="section-header">
                <h3>Recent Donations</h3>
                <button className="view-all-btn">View All</button>
            </div>

            <div className="donations-table-container">
                <table className="donations-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>ITEMS</th>
                            <th style={{ width: '20%' }}>DATE</th>
                            <th style={{ width: '20%' }}>QUANTITY</th>
                            <th style={{ width: '30%', textAlign: 'right' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((d, index) => (
                            <tr key={index}>
                                <td className="item-name">{d.item}</td>
                                <td className="item-date">{d.date}</td>
                                <td className="item-quantity">{d.quantity}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <span className={`status-badge ${getStatusClass(d.status)}`}>
                                        <span className="status-dot">•</span> {d.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentDonations;
