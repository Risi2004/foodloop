import { Link } from "react-router-dom";
import "./Navbar.css"
import arrow from "../../../assets/icons/arrow.svg"

function Navbar() {
    return (
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
    )
}

export default Navbar
