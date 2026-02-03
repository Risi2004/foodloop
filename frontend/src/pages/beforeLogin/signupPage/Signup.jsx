
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../../services/api';
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
    const navigate = useNavigate();
    const [role, setRole] = useState('Donor'); 
    const [donorType, setDonorType] = useState('Individuals'); 
    const [vehicleType, setVehicleType] = useState('Scooter'); 
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    
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
            setProfileImageFile(file);
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

    const validateForm = () => {
        const newErrors = {};

        // Common validations
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.retypePassword) {
            newErrors.retypePassword = 'Passwords do not match';
        }
        if (!formData.contactNo) newErrors.contactNo = 'Contact number is required';
        if (!formData.address) newErrors.address = 'Address is required';

        // Role-specific validations
        if (role === 'Donor' && donorType === 'Individuals') {
            if (!formData.username) newErrors.username = 'Username is required';
        } else if (role === 'Donor' && donorType === 'Business Entity') {
            if (!formData.businessName) newErrors.businessName = 'Business name is required';
            if (!formData.businessType) newErrors.businessType = 'Business type is required';
            if (!formData.businessRegFile) newErrors.businessRegFile = 'Business registration file is required';
            if (!formData.addressProofFile) newErrors.addressProofFile = 'Address proof file is required';
        } else if (role === 'Receiver') {
            if (!formData.receiverName) newErrors.receiverName = 'Receiver name is required';
            if (!formData.receiverType) newErrors.receiverType = 'Receiver type is required';
            if (!formData.businessRegFile) newErrors.businessRegFile = 'Business registration file is required';
            if (!formData.addressProofFile) newErrors.addressProofFile = 'Address proof file is required';
        } else if (role === 'Driver') {
            if (!formData.driverName) newErrors.driverName = 'Driver name is required';
            if (!formData.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required';
            if (!formData.nicFile) newErrors.nicFile = 'NIC file is required';
            if (!formData.licenseFile) newErrors.licenseFile = 'Driving license file is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create FormData object
            const submitFormData = new FormData();

            // Add common fields
            submitFormData.append('role', role);
            submitFormData.append('email', formData.email);
            submitFormData.append('password', formData.password);
            submitFormData.append('retypePassword', formData.retypePassword);
            submitFormData.append('contactNo', formData.contactNo);
            submitFormData.append('address', formData.address);

            // Add profile image
            if (profileImageFile) {
                submitFormData.append('profileImage', profileImageFile);
            }

            // Add role-specific fields
            if (role === 'Donor') {
                submitFormData.append('donorType', donorType === 'Individuals' ? 'Individual' : 'Business');
                if (donorType === 'Individuals') {
                    submitFormData.append('username', formData.username);
                } else {
                    submitFormData.append('businessName', formData.businessName);
                    submitFormData.append('businessType', formData.businessType);
                    if (formData.businessRegFile) {
                        submitFormData.append('businessRegFile', formData.businessRegFile);
                    }
                    if (formData.addressProofFile) {
                        submitFormData.append('addressProofFile', formData.addressProofFile);
                    }
                }
            } else if (role === 'Receiver') {
                submitFormData.append('receiverName', formData.receiverName);
                submitFormData.append('receiverType', formData.receiverType);
                if (formData.businessRegFile) {
                    submitFormData.append('businessRegFile', formData.businessRegFile);
                }
                if (formData.addressProofFile) {
                    submitFormData.append('addressProofFile', formData.addressProofFile);
                }
            } else if (role === 'Driver') {
                submitFormData.append('driverName', formData.driverName);
                submitFormData.append('vehicleNumber', formData.vehicleNumber);
                submitFormData.append('vehicleType', vehicleType);
                if (formData.nicFile) {
                    submitFormData.append('nicFile', formData.nicFile);
                }
                if (formData.licenseFile) {
                    submitFormData.append('licenseFile', formData.licenseFile);
                }
            }

            // Call API
            const response = await signup(submitFormData);

            if (response.success) {
                setSuccessMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            // Handle API errors
            if (error.response && error.response.data && error.response.data.errors) {
                const apiErrors = {};
                error.response.data.errors.forEach(err => {
                    apiErrors[err.field] = err.message;
                });
                setErrors(apiErrors);
            } else {
                setErrors({ submit: error.message || 'An error occurred. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
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
                                    {errors.username && <span className="error-message">{errors.username}</span>}
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
                                        {errors.businessName && <span className="error-message">{errors.businessName}</span>}
                                    </div>
                                                    <div className="input__group half">
                                        <label htmlFor="businessType">Business Type</label>
                                        <select id="businessType" value={formData.businessType} onChange={handleInputChange}>
                                            <option value="">Select</option>
                                            <option value="Restaurant">Restaurant</option>
                                            <option value="Supermarket">Supermarket</option>
                                            <option value="Wedding Hall">Wedding Hall</option>
                                        </select>
                                        {errors.businessType && <span className="error-message">{errors.businessType}</span>}
                                    </div>
                                </div>
                                <div className="input__group border__group">
                                    <label>Business Registration Cards</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('biz-reg-file')}>
                                        <span>{formData.businessRegFile ? formData.businessRegFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="biz-reg-file" hidden onChange={(e) => handleFileChange(e, 'businessRegFile')} />
                                    {errors.businessRegFile && <span className="error-message">{errors.businessRegFile}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                                <div className="input__group border__group">
                                    <label>Address Proof</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('addr-proof-file')}>
                                        <span>{formData.addressProofFile ? formData.addressProofFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="addr-proof-file" hidden onChange={(e) => handleFileChange(e, 'addressProofFile')} />
                                    {errors.addressProofFile && <span className="error-message">{errors.addressProofFile}</span>}
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
                                        {errors.receiverName && <span className="error-message">{errors.receiverName}</span>}
                                    </div>
                                    <div className="input__group half">
                                        <label htmlFor="receiverType">Receiver Type</label>
                                        <select id="receiverType" value={formData.receiverType} onChange={handleInputChange}>
                                            <option value="">Select</option>
                                            <option value="NGO">NGO</option>
                                            <option value="Food Banks">Food Banks</option>
                                            <option value="Service Organization">Service Organization</option>
                                        </select>
                                        {errors.receiverType && <span className="error-message">{errors.receiverType}</span>}
                                    </div>
                                </div>
                                <div className="input__group border__group">
                                    <label>Business Registration Cards</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('rec-biz-reg-file')}>
                                        <span>{formData.businessRegFile ? formData.businessRegFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="rec-biz-reg-file" hidden onChange={(e) => handleFileChange(e, 'businessRegFile')} />
                                    {errors.businessRegFile && <span className="error-message">{errors.businessRegFile}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                                <div className="input__group border__group">
                                    <label>Address Proof</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('rec-addr-proof-file')}>
                                        <span>{formData.addressProofFile ? formData.addressProofFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="rec-addr-proof-file" hidden onChange={(e) => handleFileChange(e, 'addressProofFile')} />
                                    {errors.addressProofFile && <span className="error-message">{errors.addressProofFile}</span>}
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
                                        {errors.driverName && <span className="error-message">{errors.driverName}</span>}
                                    </div>
                                    <div className="input__group half">
                                        <label htmlFor="vehicleNumber">Vehicle number</label>
                                        <input type="text" id="vehicleNumber" placeholder="BYD 2344" value={formData.vehicleNumber} onChange={handleInputChange} />
                                        {errors.vehicleNumber && <span className="error-message">{errors.vehicleNumber}</span>}
                                    </div>
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>

                                <div className="input__group border__group">
                                    <label>NIC (Front & Back view)</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('nic-file')}>
                                        <span>{formData.nicFile ? formData.nicFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="nic-file" hidden onChange={(e) => handleFileChange(e, 'nicFile')} />
                                    {errors.nicFile && <span className="error-message">{errors.nicFile}</span>}
                                </div>
                                <div className="input__group border__group">
                                    <label>Driving License (Front & Back view)</label>
                                    <div className="file__drop" onClick={() => triggerFileUpload('license-file')}>
                                        <span>{formData.licenseFile ? formData.licenseFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="license-file" hidden onChange={(e) => handleFileChange(e, 'licenseFile')} />
                                    {errors.licenseFile && <span className="error-message">{errors.licenseFile}</span>}
                                </div>
                            </>
                        )}

                        {}
                        <div className="row">
                            <div className="input__group half">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="*******" value={formData.password} onChange={handleInputChange} />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>
                            <div className="input__group half">
                                <label htmlFor="retypePassword">Retype Password</label>
                                <input type="password" id="retypePassword" placeholder="******" value={formData.retypePassword} onChange={handleInputChange} />
                                {errors.retypePassword && <span className="error-message">{errors.retypePassword}</span>}
                            </div>
                        </div>

                    </div>

                    {/* Error and Success Messages */}
                    {errors.submit && (
                        <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                            {errors.submit}
                        </div>
                    )}
                    {successMessage && (
                        <div className="success-message" style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>
                            {successMessage}
                        </div>
                    )}

                    <button 
                        className="create__account__btn" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="signup__footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SignupPage;
