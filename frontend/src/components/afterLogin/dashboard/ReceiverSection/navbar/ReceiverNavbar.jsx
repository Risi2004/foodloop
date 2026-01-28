import { Link } from "react-router-dom";
import React, { useState } from 'react';
import "./ReceiverNavbar.css"
import notification from "../../../../../assets/icons/afterLogin/navbar/notification.svg"
import profile from "../../../../../assets/icons/afterLogin/navbar/profile.svg"
import menu from "../../../../../assets/icons/navbar/menu-bar.svg"

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen)
    }
    return (
        <>
            <div className="navbar">
                <div className="navbar__s1">
                    <img src="/logo.png" alt="logo" />
                    <div className="navbar__s1__sub">
                        <h2> <span className="navbar__s1__sub__part1">Food</span><span className="navbar__s1__sub__part2">Loop</span></h2>
                        <p>Zero Waste. Infinite Impact</p>
                    </div>
                </div>

                <div className="navbar__s2">
                    <Link to="/">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="">Find Food</Link>
                    <Link to="">My Claims</Link>
                </div>

                <div className="navbar__s3">
                    <img className="navbar__s3__img1" src={notification} alt="notification-icon" />
                    <div className="navbar__s3__sub" onClick={toggleProfile}>
                        <h3>User_Name</h3>
                        <img className="navbar__s3__img2" src={profile} alt="profile-icon" />
                    </div>
                </div>
                {isProfileOpen && (
                    <div className="navbar__s3__profile__popup">
                        <p onClick={toggleProfile}>X</p>
                        <Link to="" onClick={toggleProfile}>View Profile</Link>
                        <Link to="" onClick={toggleProfile}>
                            <button>Sign Out</button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="responsive__navbar">
                <div className="responsive__navbar__s1">
                    <img src="/logo.png" alt="logo" />
                </div>
                <div className="responsive__navbar__s2">
                    <h2> <span className="responsive__navbar__s2__part1">Food</span><span className="responsive__navbar__s2__part2">Loop</span></h2>
                    <p>Zero Waste. Infinite Impact</p>
                </div>
                <div className="responsive__navbar__s3">
                    <img src={notification} alt="notification-icon" />
                    <img src={menu} alt="menu-bar" onClick={toggleMenu} />
                </div>
            </div>

            {isMenuOpen && (
                <div className="responsive__navbar__popup">
                    <p onClick={toggleMenu}>X</p>
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                    <Link to="/about" onClick={toggleMenu}>About Us</Link>
                    <Link to="/contact" onClick={toggleMenu}>Contact Us</Link>
                    <Link to="" onClick={toggleMenu}>Find Food</Link>
                    <Link to="" onClick={toggleMenu}>My Claims</Link>
                    <Link to="" onClick={toggleMenu}>View Profile</Link>
                    <Link to="" onClick={toggleMenu}>
                        <button>Sign Out</button>
                    </Link>
                </div>
            )}
        </>
    )
}

export default Navbar