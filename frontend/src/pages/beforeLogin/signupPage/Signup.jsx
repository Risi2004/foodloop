
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
import defaultProfileIcon from '../../../assets/icons/afterLogin/navbar/profile.svg';

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

    // Validation patterns (shared where noted)
    const INDIVIDUAL_DONOR_NAME_REGEX = /^[a-zA-Z\s]+$/; // Individual Donor "Name" (letters and spaces only)
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const CONTACT_REGEX = /^\d{10}$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_+=])[A-Za-z\d@$!%*?&#^()\-_+=]{8,}$/;
    const BUSINESS_NAME_REGEX = /^[a-zA-Z\s]+$/;
    const RECEIVER_NAME_REGEX = /^[a-zA-Z\s]+$/;
    const DRIVER_NAME_REGEX = /^[a-zA-Z\s]+$/;
    const VEHICLE_NUMBER_REGEX = /^[a-zA-Z0-9\s]+$/;

    const validateIndividualDonorField = (fieldId, value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        switch (fieldId) {
            case 'username':
                if (!trimmed) return 'Name is required';
                if (!INDIVIDUAL_DONOR_NAME_REGEX.test(trimmed)) return 'Name must contain only letters and spaces (no special characters)';
                return null;
            case 'email':
                if (!trimmed) return 'Email is required';
                if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address';
                return null;
            case 'contactNo':
                if (!trimmed) return 'Contact number is required';
                if (!CONTACT_REGEX.test(trimmed.replace(/\s/g, ''))) return 'Contact number must be exactly 10 digits';
                return null;
            case 'password':
                if (!value) return 'Password is required';
                if (!PASSWORD_REGEX.test(value)) return 'Password must be at least 8 characters with a mix of uppercase, lowercase, numbers and symbols';
                return null;
            case 'retypePassword':
                if (!value) return 'Retype password is required';
                if (formData.password !== value) return 'Passwords do not match';
                return null;
            default:
                return null;
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleIndividualDonorBlur = (e) => {
        if (role !== 'Donor' || donorType !== 'Individuals') return;
        const fieldId = e.target.id;
        const value = e.target.value;
        const error = validateIndividualDonorField(fieldId, value);
        setErrors((prev) => ({ ...prev, [fieldId]: error || undefined }));
    };

    const validateCommonField = (fieldId, value) => {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        switch (fieldId) {
            case 'email':
                if (!trimmed) return 'Email is required';
                if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address';
                return null;
            case 'contactNo':
                if (!trimmed) return 'Contact number is required';
                if (!CONTACT_REGEX.test(trimmed.replace(/\s/g, ''))) return 'Contact number must be exactly 10 digits';
                return null;
            case 'businessName':
                if (!trimmed) return 'Business name is required';
                if (!BUSINESS_NAME_REGEX.test(trimmed)) return 'Business name must contain only letters and spaces';
                return null;
            case 'receiverName':
                if (!trimmed) return 'Receiver name is required';
                if (!RECEIVER_NAME_REGEX.test(trimmed)) return 'Receiver name must contain only letters and spaces';
                return null;
            case 'driverName':
                if (!trimmed) return 'Driver name is required';
                if (!DRIVER_NAME_REGEX.test(trimmed)) return 'Driver name must contain only letters and spaces';
                return null;
            case 'vehicleNumber':
                if (!trimmed) return 'Vehicle number is required';
                if (!VEHICLE_NUMBER_REGEX.test(trimmed)) return 'Vehicle number can contain only letters, numbers and spaces (no special characters)';
                return null;
            default:
                return null;
        }
    };

    const handleSignupBlur = (e) => {
        const fieldId = e.target.id;
        const value = e.target.value;
        if (fieldId === 'email' || fieldId === 'contactNo') {
            const error = validateCommonField(fieldId, value);
            setErrors((prev) => ({ ...prev, [fieldId]: error || undefined }));
            return;
        }
        if (fieldId === 'businessName' && role === 'Donor' && donorType === 'Business Entity') {
            const error = validateCommonField('businessName', value);
            setErrors((prev) => ({ ...prev, businessName: error || undefined }));
            return;
        }
        if ((fieldId === 'receiverName' && role === 'Receiver') || ((fieldId === 'driverName' || fieldId === 'vehicleNumber') && role === 'Driver')) {
            const error = validateCommonField(fieldId, value);
            setErrors((prev) => ({ ...prev, [fieldId]: error || undefined }));
        }
    };

    const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setErrors((prev) => ({ ...prev, [key]: 'Only PDF files are allowed.' }));
            setFormData((prev) => ({ ...prev, [key]: null }));
            e.target.value = '';
            return;
        }
        if (file.size > MAX_PDF_SIZE) {
            setErrors((prev) => ({ ...prev, [key]: 'File must be 10 MB or smaller.' }));
            setFormData((prev) => ({ ...prev, [key]: null }));
            e.target.value = '';
            return;
        }
        setErrors((prev) => ({ ...prev, [key]: undefined }));
        setFormData((prev) => ({ ...prev, [key]: file }));
    };

    const triggerFileUpload = (id) => {
        document.getElementById(id).click();
    };

    const ALLOWED_PROFILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    const MAX_PROFILE_SIZE = 10 * 1024 * 1024; // 10 MB

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Clear previous error
        setErrors((prev) => ({ ...prev, profileImage: undefined }));

        if (!ALLOWED_PROFILE_TYPES.includes(file.type)) {
            setErrors((prev) => ({ ...prev, profileImage: 'Profile picture must be JPEG, JPG, or PNG only.' }));
            setProfileImage(null);
            setProfileImageFile(null);
            e.target.value = '';
            return;
        }

        if (file.size > MAX_PROFILE_SIZE) {
            setErrors((prev) => ({ ...prev, profileImage: 'Profile picture must be 10 MB or smaller.' }));
            setProfileImage(null);
            setProfileImageFile(null);
            e.target.value = '';
            return;
        }

        setProfileImage(URL.createObjectURL(file));
        setProfileImageFile(file);
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

    const getValidationErrors = () => {
        const newErrors = {};

        // Common validations (all required except profile picture) — email & contact use regex for all roles
        const emailErr = validateCommonField('email', formData.email);
        if (emailErr) newErrors.email = emailErr;
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password && formData.password.length < 6 && (role !== 'Donor' || donorType !== 'Individuals')) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.retypePassword) newErrors.retypePassword = 'Retype password is required';
        else if (formData.password !== formData.retypePassword) {
            newErrors.retypePassword = 'Passwords do not match';
        }
        const contactErr = validateCommonField('contactNo', formData.contactNo);
        if (contactErr) newErrors.contactNo = contactErr;
        if (!formData.address?.trim()) newErrors.address = 'Address is required';

        // Role-specific validations (all required except profile picture)
        if (role === 'Donor' && donorType === 'Individuals') {
            const usernameErr = validateIndividualDonorField('username', formData.username);
            if (usernameErr) newErrors.username = usernameErr;
            const passwordErr = validateIndividualDonorField('password', formData.password);
            if (passwordErr) newErrors.password = passwordErr;
            const retypeErr = validateIndividualDonorField('retypePassword', formData.retypePassword);
            if (retypeErr) newErrors.retypePassword = retypeErr;
        } else if (role === 'Donor' && donorType === 'Business Entity') {
            const businessNameErr = validateCommonField('businessName', formData.businessName);
            if (businessNameErr) newErrors.businessName = businessNameErr;
            if (!formData.businessType) newErrors.businessType = 'Business type is required';
            if (!formData.businessRegFile) newErrors.businessRegFile = 'Business registration file is required';
            if (!formData.addressProofFile) newErrors.addressProofFile = 'Address proof file is required';
        } else if (role === 'Receiver') {
            const receiverNameErr = validateCommonField('receiverName', formData.receiverName);
            if (receiverNameErr) newErrors.receiverName = receiverNameErr;
            if (!formData.receiverType) newErrors.receiverType = 'Receiver type is required';
            if (!formData.businessRegFile) newErrors.businessRegFile = 'Business registration file is required';
            if (!formData.addressProofFile) newErrors.addressProofFile = 'Address proof file is required';
        } else if (role === 'Driver') {
            const driverNameErr = validateCommonField('driverName', formData.driverName);
            if (driverNameErr) newErrors.driverName = driverNameErr;
            const vehicleNumberErr = validateCommonField('vehicleNumber', formData.vehicleNumber);
            if (vehicleNumberErr) newErrors.vehicleNumber = vehicleNumberErr;
            if (!formData.nicFile) newErrors.nicFile = 'NIC file is required';
            if (!formData.licenseFile) newErrors.licenseFile = 'Driving license file is required';
        }

        return newErrors;
    };

    const validateForm = () => {
        const newErrors = getValidationErrors();
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validationErrors = getValidationErrors();
    const profileError = errors.profileImage;
    const isFormValid = Object.keys(validationErrors).length === 0 && !profileError;
    const submitDisabled = loading || !isFormValid;
    const submitReason = submitDisabled && !loading
        ? [...Object.values(validationErrors), profileError].filter(Boolean).join(' • ')
        : '';

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
                                <img src={defaultProfileIcon} alt="Profile" className="default__icon" />
                            )}
                        </label>
                        <input
                            type="file"
                            id="profile-upload"
                            accept="image/jpeg,image/jpg,image/png"
                            hidden
                            onChange={handleImageUpload}
                        />
                        {errors.profileImage && (
                            <span className="error-message" style={{ textAlign: 'center' }}>{errors.profileImage}</span>
                        )}
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
                                    <label htmlFor="username">Name</label>
                                    <input type="text" id="username" placeholder="Eg: John" value={formData.username} onChange={handleInputChange} onBlur={handleIndividualDonorBlur} />
                                    {errors.username && <span className="error-message">{errors.username}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} onBlur={handleIndividualDonorBlur} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} onBlur={handleIndividualDonorBlur} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                            </>
                        )}

                        {}
                        {role === 'Donor' && donorType === 'Business Entity' && (
                            <>
                                <div className="row">
                                    <div className="input__group half">
                                        <label htmlFor="businessName">Business Name</label>
                                        <input type="text" id="businessName" placeholder="xmksn" value={formData.businessName} onChange={handleInputChange} onBlur={handleSignupBlur} />
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
                                    <span className="file__hint">Upload PDF only</span>
                                    <div className="file__drop" onClick={() => triggerFileUpload('biz-reg-file')}>
                                        <span>{formData.businessRegFile ? formData.businessRegFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="biz-reg-file" accept="application/pdf" hidden onChange={(e) => handleFileChange(e, 'businessRegFile')} />
                                    {errors.businessRegFile && <span className="error-message">{errors.businessRegFile}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                                <div className="input__group border__group">
                                    <label>Address Proof</label>
                                    <span className="file__hint">Upload PDF only</span>
                                    <div className="file__drop" onClick={() => triggerFileUpload('addr-proof-file')}>
                                        <span>{formData.addressProofFile ? formData.addressProofFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="addr-proof-file" accept="application/pdf" hidden onChange={(e) => handleFileChange(e, 'addressProofFile')} />
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
                                        <input type="text" id="receiverName" placeholder="xmksn" value={formData.receiverName} onChange={handleInputChange} onBlur={handleSignupBlur} />
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
                                    <span className="file__hint">Upload PDF only</span>
                                    <div className="file__drop" onClick={() => triggerFileUpload('rec-biz-reg-file')}>
                                        <span>{formData.businessRegFile ? formData.businessRegFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="rec-biz-reg-file" accept="application/pdf" hidden onChange={(e) => handleFileChange(e, 'businessRegFile')} />
                                    {errors.businessRegFile && <span className="error-message">{errors.businessRegFile}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>
                                <div className="input__group border__group">
                                    <label>Address Proof</label>
                                    <span className="file__hint">Upload PDF only</span>
                                    <div className="file__drop" onClick={() => triggerFileUpload('rec-addr-proof-file')}>
                                        <span>{formData.addressProofFile ? formData.addressProofFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="rec-addr-proof-file" accept="application/pdf" hidden onChange={(e) => handleFileChange(e, 'addressProofFile')} />
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
                                        <input type="text" id="driverName" placeholder="xmksn" value={formData.driverName} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                        {errors.driverName && <span className="error-message">{errors.driverName}</span>}
                                    </div>
                                    <div className="input__group half">
                                        <label htmlFor="vehicleNumber">Vehicle number</label>
                                        <input type="text" id="vehicleNumber" placeholder="BYD 2344" value={formData.vehicleNumber} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                        {errors.vehicleNumber && <span className="error-message">{errors.vehicleNumber}</span>}
                                    </div>
                                </div>
                                <div className="input__group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Eg:-John Doe@gmail.com" value={formData.email} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="contactNo">Contact No</label>
                                    <input type="text" id="contactNo" placeholder="Eg:-854558415" value={formData.contactNo} onChange={handleInputChange} onBlur={handleSignupBlur} />
                                    {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
                                </div>
                                <div className="input__group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" id="address" placeholder="Eg:-colombo" value={formData.address} onChange={handleInputChange} />
                                    {errors.address && <span className="error-message">{errors.address}</span>}
                                </div>

                                <div className="input__group border__group">
                                    <label>NIC (Front & Back view)</label>
                                    <span className="file__hint">Upload PDF only</span>
                                    <div className="file__drop" onClick={() => triggerFileUpload('nic-file')}>
                                        <span>{formData.nicFile ? formData.nicFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="nic-file" accept="application/pdf" hidden onChange={(e) => handleFileChange(e, 'nicFile')} />
                                    {errors.nicFile && <span className="error-message">{errors.nicFile}</span>}
                                </div>
                                <div className="input__group border__group">
                                    <label>Driving License (Front & Back view)</label>
                                    <span className="file__hint">Upload PDF only</span>
                                    <div className="file__drop" onClick={() => triggerFileUpload('license-file')}>
                                        <span>{formData.licenseFile ? formData.licenseFile.name : 'Import or Drag File'}</span>
                                        <button className="add__file__btn" type="button">Add File</button>
                                    </div>
                                    <input type="file" id="license-file" accept="application/pdf" hidden onChange={(e) => handleFileChange(e, 'licenseFile')} />
                                    {errors.licenseFile && <span className="error-message">{errors.licenseFile}</span>}
                                </div>
                            </>
                        )}

                        {}
                        <div className="row">
                            <div className="input__group half">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="*******" value={formData.password} onChange={handleInputChange} onBlur={handleIndividualDonorBlur} />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>
                            <div className="input__group half">
                                <label htmlFor="retypePassword">Retype Password</label>
                                <input type="password" id="retypePassword" placeholder="******" value={formData.retypePassword} onChange={handleInputChange} onBlur={handleIndividualDonorBlur} />
                                {errors.retypePassword && <span className="error-message">{errors.retypePassword}</span>}
                            </div>
                        </div>

                    </div>

                    {/* Error and Success Messages */}
                    {errors.submit && (
                        <div className="error-message" style={{ marginBottom: '10px', textAlign: 'center' }}>
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
                        disabled={submitDisabled}
                        title={submitReason}
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
