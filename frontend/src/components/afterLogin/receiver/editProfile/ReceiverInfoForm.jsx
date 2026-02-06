import React, { useState, useEffect } from 'react';
import './ReceiverInfoForm.css';

function ReceiverInfoForm({ user, onSave, onCancel, saving = false }) {
    const [receiverName, setReceiverName] = useState('');
    const [receiverType, setReceiverType] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (user) {
            setReceiverName(user.receiverName ?? '');
            setReceiverType(user.receiverType ?? '');
            setEmail(user.email ?? '');
            setContactNo(user.contactNo ?? '');
            setAddress(user.address ?? '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (saving) return;
        onSave?.({
            receiverName: receiverName.trim() || undefined,
            receiverType: receiverType || undefined,
            email: email.trim() || undefined,
            contactNo: contactNo.trim() || undefined,
            address: address.trim() || undefined,
        });
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <div className="receiver-info-card">
            <div className="receiver-info-header">
                <span className="icon">🏢</span>
                <h3>Organization Information</h3>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="receiver-form-grid">
                    <div className="form-group">
                        <label htmlFor="receiver-name">Organization name</label>
                        <input
                            id="receiver-name"
                            type="text"
                            placeholder="Eg:- Nourish Community"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="receiver-type">Organization type</label>
                        <select
                            id="receiver-type"
                            value={receiverType}
                            onChange={(e) => setReceiverType(e.target.value)}
                        >
                            <option value="">Select type</option>
                            <option value="NGO">NGO</option>
                            <option value="Food Banks">Food Banks</option>
                            <option value="Service Organization">Service Organization</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="receiver-email">Email</label>
                        <input
                            id="receiver-email"
                            type="email"
                            placeholder="Eg:- contact@org.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="receiver-contactNo">Contact number</label>
                        <input
                            id="receiver-contactNo"
                            type="text"
                            placeholder="Eg:- 0758261526"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="receiver-address">Address</label>
                        <textarea
                            id="receiver-address"
                            placeholder="Eg:- 123 Main Street, City"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <div className="receiver-form-actions">
                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="save-btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
            </form>
        </div>
    );
}

export default ReceiverInfoForm;
