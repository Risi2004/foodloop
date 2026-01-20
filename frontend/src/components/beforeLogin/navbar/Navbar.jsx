import { Link } from "react-router-dom";
import React, { useState } from 'react';
import "./Navbar.css"
import arrow from "../../../assets/icons/arrow.svg"
import menu from "../../../assets/icons/menu-bar.svg"

function Navbar() {
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
                    <Link to="">Home</Link>
                    <Link to="">About Us</Link>
                    <Link to="">Contact Us</Link>
                </div>
                <div className="navbar__s3">
                    <button>
                        <p>Login</p>
                        <img src={arrow} alt="arrow" />
                    </button>
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
                    <Link to="" onClick={toggleMenu}>Home</Link>
                    <Link to="" onClick={toggleMenu}>About Us</Link>
                    <Link to="" onClick={toggleMenu}>Contact Us</Link>
                    <Link to="" onClick={toggleMenu} ><button>Login</button></Link>
                </div>
            )}
        </>
    )
}

export default Navbar
