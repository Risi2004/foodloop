import { Link } from "react-router-dom";
import React, { useState } from 'react';
import "./DonorNavbar.css"
import arrow from "../../../../assets/icons/navbar/arrow.svg"
import menu from "../../../../assets/icons/navbar/menu-bar.svg"

function Navbar({ isLoggedIn }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
                    {isLoggedIn && <Link to="/my-donations" className="active-link">MyDonation</Link>}
                </div>

                <div className="navbar__s3">
                    {isLoggedIn ? (
                        <div className="navbar__logged__in">
                            <span>User_Name</span>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button>
                                <p>Login</p>
                                <img src={arrow} alt="arrow" />
                            </button>
                        </Link>
                    )}
                </div>
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
                    <img src={menu} alt="menu-bar" onClick={toggleMenu} />
                </div>
            </div>

            {isMenuOpen && (
                <div className="responsive__navbar__popup">
                    <p onClick={toggleMenu}>X</p>
                    <Link to="/" onClick={toggleMenu}>Home</Link>
                    <Link to="/about" onClick={toggleMenu}>About Us</Link>
                    <Link to="/contact" onClick={toggleMenu}>Contact Us</Link>
                    {isLoggedIn && <Link to="/my-donations" onClick={toggleMenu}>MyDonation</Link>}

                    {!isLoggedIn ? (
                        <Link to="/login" onClick={toggleMenu}><button>Login</button></Link>
                    ) : (
                        <div className="mobile__user__info">
                            <span>User_Name</span>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Navbar