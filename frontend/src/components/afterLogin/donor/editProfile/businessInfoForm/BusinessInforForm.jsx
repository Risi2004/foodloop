import './BusinessInfoForm.css';

function BusinessInfoForm() {
    return (
        <div className="business-info-card">
            <div className="section-header">
                <span className="icon">👤</span>
                <h3>Business Information</h3>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Business name</label>
                    <input type="text" placeholder="Eg:-jjhon." />
                </div>
                <div className="form-group">
                    <label>Sustainability Contact Email</label>
                    <input type="email" placeholder="Eg:-jjhon@gmail.com." />
                </div>
                <div className="form-group">
                    <label>Sustainability name</label>
                    <input type="text" placeholder="Eg:-jjhon." />
                </div>
                <div className="form-group">
                    <label>Registration No.</label>
                    <input type="text" placeholder="REG-882910-NYC" disabled className="disabled-input" />
                </div>
                <div className="form-group full-width">
                    <label>Pickup Address</label>
                    <textarea placeholder="Eg:-Downtown Financial District, NY 10004."></textarea>
                </div>
            </div>

            <div className="form-actions">
                <button className="cancel-btn">Cancel</button>
                <button className="save-btn">Save</button>
            </div>
        </div>
    );
}

export default BusinessInfoForm;
