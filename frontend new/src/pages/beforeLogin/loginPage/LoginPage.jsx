
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import loginImage from '../../../assets/images/login/login.svg';
import eye from "../../../assets/icons/login/eye-icon.svg"
import receive from "../../../assets/icons/login/receive.svg"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login__page">
            <div className="login__container">
                <div className="login__form__section">
                    <div className="login__header">
                        <div className="brand__logo">
                            <img src="/logo.png" alt="FoodLoop Logo" />
                            <div className="brand__text">
                                <h2><span className="brand__green">Food</span><span className="brand__leaf">Loop</span></h2>
                                <p>Zero Waste. Infinite Impact</p>
                            </div>
                        </div>
                        <h1>Welcome Back</h1>
                        <p className="subtitle">Connect to minimize waste and maximize impact.</p>
                    </div>

                    <div className="form__card">
                        <div className="input__group">
                            <label htmlFor="email">Email or Username</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="Eg:-john or johndoe@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input__group">
                            <label htmlFor="password">Password</label>
                            <div className="password__input__wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="**************"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="toggle__password" onClick={togglePasswordVisibility} style={{ zIndex: 10 }}>
                                    {showPassword ? (
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Hide</span>
                                    ) : (
                                        <img src={eye} alt="Show Password" />
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="form__actions">
                            <a href="#" className="forgot__password">Forgot Password?</a>
                            <input type="checkbox" className="remember__me" />
                        </div>

                        <button className="login__btn">Login</button>
                    </div>

                    <div className="login__footer">
                        <p>Don't have an account?</p>
                        <Link to="/signup">Sign up as a Donor, Volunteer or NGO</Link>
                    </div>
                </div>

                <div className="login__image__section">
                    <img src={loginImage} alt="Volunteers distributing food" className="side__image" />
                    <div className="image__overlay">
                        <div className="quote__box">
                            <div className="quote__icon">
                                <img src={receive} alt="Impact Icon" />
                            </div>
                            <div className="quote__text">
                                <p className='quote__text__quote'>"Last year alone, we rescued over 50 tons of food and served 20,000 meals to those in need."</p>
                                <p className='quote__text__told'>- The Food Loop Impact Report</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default LoginPage;
