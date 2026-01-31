
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';


import donorImg from '../../../assets/images/sign-up/donor.svg';
import donorBusinessImg from '../../../assets/images/sign-up/donor-business.svg';
import receiverImg from '../../../assets/images/sign-up/receiver.svg';
import driverImg from '../../../assets/images/sign-up/driver.svg';


import scooterIcon from '../../../assets/icons/signup/scooter.svg';
import bikeIcon from '../../../assets/icons/signup/motorcycle.svg';
import carIcon from '../../../assets/icons/signup/car.svg';
import truckIcon from '../../../assets/icons/signup/truck.svg';

function SignupPage() {
    const [role, setRole] = useState('Donor'); 
    const [donorType, setDonorType] = useState('Individuals'); 
    const [vehicleType, setVehicleType] = useState('Scooter'); 
    const [profileImage, setProfileImage] = useState(null);

    
    const [formData, setFormData] = useState({
        username: '',
        businessName: '',
        businessType: '',
        email: '',
        contactNo: '',
        address: '',
        password: '',
        retypePassword: '',
        vehicleNumber: '',
        receiverName: '',
        receiverType: '',
        driverName: '',
        
        businessRegFile: null,
        addressProofFile: null,
        nicFile: null,
        licenseFile: null,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [key]: file });
        }
    };

    const triggerFileUpload = (id) => {
        document.getElementById(id).click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    
    const getCurrentImage = () => {
        if (role === 'Donor') {
            return donorType === 'Business Entity' ? donorBusinessImg : donorImg;
        }
        if (role === 'Receiver') return receiverImg;
        if (role === 'Driver') return driverImg;
        return donorImg;
    };

    
    const getTitle = () => {
        if (role === 'Donor') return 'Create Donor Account';
        if (role === 'Receiver') return 'Create Receiver Account';
        if (role === 'Driver') return 'Create Volunteer Driver Account';
    };

    return (
        <div className="signup__page">
            <div className="signup__container">
                {}
                <div className="signup__image__section">
                    <img src={getCurrentImage()} alt="Signup Illustration" className="side__image" />
                    <div className="image__overlay">
                        <div className="quote__box">
                            {}
                            {(role === 'Driver' || role === 'Receiver') ? (
                                <>
                                    <h1 className="image__quote__title">Partner with us to end hunger</h1>
                                    <p className="image__quote__subtitle">Join the transparency loop. Connect with donors and volunteers to distribute surplus food efficiently to those in need.</p>
                                </>
                            ) : (
                                <>
                                    {}
                                    <h1 className="image__quote__title">Turn Surplus into Sustenance</h1>
                                    <p className="image__quote__subtitle">Join our community of donors and ensure no food goes to waste. Your contributions feed families, not landfills.</p>
                                </>
                            )}

                            {}
                            <div className="active__donors">
                                <div className="avatars">
                                    {}
                                    <div className="avatar">🍕</div>
                                    <div className="avatar">🍎</div>
                                    <div className="avatar">🍞</div>
                                </div>
                                <p>Active donors <br /> worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="signup__form__section">
                    <h1 className="signup__title">{getTitle()}</h1>

                    {}
                    <div className="profile__upload">
                        <label htmlFor="profile-upload" className="profile__circle">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <span className="default__icon">👤</span>
                            )}
                        </label>
                        <input type="file" id="profile-upload" hidden onChange={handleImageUpload} />
                        <p className="profile__label">Profile Photo (File Upload)</p>
                    </div>

                    {}
                    <div className="role__toggle__container">
                        <span className="role__label">Your Role</span>
                        <div className="role__toggle">
                            <button
                                className={`role__btn ${role === 'Donor' ? 'active' : ''}`}
                                onClick={() => setRole('Donor')}
                            >Donor</button>
                            <button
                                className={`role__btn ${role === 'Receiver' ? 'active' : ''}`}
                                onClick={() => setRole('Receiver')}
                            >Receiver</button>
                            <button
                                className={`role__btn ${role === 'Driver' ? 'active' : ''}`}
                                onClick={() => setRole('Driver')}
                            >Driver</button>
                        </div>
                    </div>

                    {}
                    {role === 'Donor' && (
                        <div className="sub__toggle__container">
                            <span className="sub__toggle__label">Type Of Donor</span>
                            <div className="sub__toggle">
                                <button
                                    className={`sub__btn ${donorType === 'Individuals' ? 'active' : ''}`}
                                    onClick={() => setDonorType('Individuals')}
                                >Individuals</button>
                                <button
                                    className={`sub__btn ${donorType === 'Business Entity' ? 'active' : ''}`}
                                    onClick={() => setDonorType('Business Entity')}
                                >Business Entity</button>
                            </div>
                        </div>
                    )}

                    {role === 'Driver' && (
                        <div className="sub__toggle__container">
                            <span className="sub__toggle__label">Vehicle types</span>
                            <div className="vehicle__toggle">
                                <button className={`veh__btn ${vehicleType === 'Scooter' ? 'active' : ''}`} onClick={() => setVehicleType('Scooter')}>
                                    <img src={scooterIcon} alt="Scooter" />
                                </button>
                                <button className={`veh__btn ${vehicleType === 'Bike' ? 'active' : ''}`} onClick={() => setVehicleType('Bike')}>
                                    <img src={bikeIcon} alt="Bike" />
                                </button>
                                <button className={`veh__btn ${vehicleType === 'Car' ? 'active' : ''}`} onClick={() => setVehicleType('Car')}>
                                    <img src={carIcon} alt="Car" />
                                </button>
                                <button className={`veh__btn ${vehicleType === 'Truck' ? 'active' : ''}`} onClick={() => setVehicleType('Truck')}>
                                    <img src={truckIcon} alt="Truck" />
                                </button>
                            </div>
                        </div>
                    )}

                    {}
                    <div className="form__fields">
                        {}
                        {role === 'Donor' && donorType === 'Individuals' && (
                            <>
                                <div className="input__group">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" id="username" placeholder="Eg:-jjhon." value={formData.username} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                </div>
                            </>
                        )}

                        {}
                        {role === 'Donor' && donorType === 'Business Entity' && (
                            <>
                                <div className="row">
                                    <div className="input__group half">
                                        <label htmlFor="businessName">Business Name</label>
                                        <input type="text" id="businessName" placeholder="xmksn" value={formData.businessName} onChange={handleInputChange} />
                                    </div>
                                    <div className="input__group half">
                                        <label htmlFor="businessType">Business Type</label>
                                        <select id="businessType">
                                            <option>Select</option>
                                            <option>Restaurant</option>
                                            <option>Supermarket</option>
                                            <option>Wedding Hall</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="input__group border__group">
                                    <label>Business Registration Cards</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('biz-reg-file')}>
                                        <span>{formData.businessRegFile ? formData.businessRegFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="biz-reg-file" hidden onChange={(e) => handleFileChange(e, 'businessRegFile')} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="input__group border__group">
                                    <label>Address Proof</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('addr-proof-file')}>
                                        <span>{formData.addressProofFile ? formData.addressProofFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="addr-proof-file" hidden onChange={(e) => handleFileChange(e, 'addressProofFile')} />
                                </div>
                            </>
                        )}

                        {}
                        {role === 'Receiver' && (
                            <>
                                <div className="row">
                                    <div className="input__group half">
                                        <label htmlFor="receiverName">Receiver Name</label>
                                        <input type="text" id="receiverName" placeholder="xmksn" value={formData.receiverName} onChange={handleInputChange} />
                                    </div>
                                    <div className="input__group half">
                                        <label htmlFor="receiverType">Receiver Type</label>
                                        <select id="receiverType">
                                            <option>Select</option>
                                            <option>NGO</option>
                                            <option>Food Banks</option>
                                            <option>Service Organization</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="input__group border__group">
                                    <label>Business Registration Cards</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('rec-biz-reg-file')}>
                                        <span>{formData.businessRegFile ? formData.businessRegFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="rec-biz-reg-file" hidden onChange={(e) => handleFileChange(e, 'businessRegFile')} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="input__group border__group">
                                    <label>Address Proof</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('rec-addr-proof-file')}>
                                        <span>{formData.addressProofFile ? formData.addressProofFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="rec-addr-proof-file" hidden onChange={(e) => handleFileChange(e, 'addressProofFile')} />
                                </div>
                            </>
                        )}

                        {}
                        {role === 'Driver' && (
                            <>
                                <div className="row">
                                    <div className="input__group half">
                                        <label htmlFor="driverName">Driver Name</label>
                                        <input type="text" id="driverName" placeholder="xmksn" value={formData.driverName} onChange={handleInputChange} />
                                    </div>
                                    <div className="input__group half">
                                        <label htmlFor="vehicleNumber">Vehicle number</label>
                                        <input type="text" id="vehicleNumber" placeholder="BYD 2344" value={formData.vehicleNumber} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                </div>

                                <div className="input__group border__group">
                                    <label>NIC (Front & Back view)</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('nic-file')}>
                                        <span>{formData.nicFile ? formData.nicFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="nic-file" hidden onChange={(e) => handleFileChange(e, 'nicFile')} />
                                </div>
                                <div className="input__group border__group">
                                    <label>Driving License (Front & Back view)</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('license-file')}>
                                        <span>{formData.licenseFile ? formData.licenseFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="license-file" hidden onChange={(e) => handleFileChange(e, 'licenseFile')} />
                                </div>
                            </>
                        )}

                        {}
                        <div className="row">
                            <div className="input__group half">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="*******" value={formData.password} onChange={handleInputChange} />
                            </div>
                            <div className="input__group half">
                                <label htmlFor="retypePassword">Retype Password</label>
                                <input type="password" id="retypePassword" placeholder="******" value={formData.retypePassword} onChange={handleInputChange} />
                            </div>
                        </div>

                    </div>

                    <button className="create__account__btn">Create Account</button>

                    <div className="signup__footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SignupPage;
