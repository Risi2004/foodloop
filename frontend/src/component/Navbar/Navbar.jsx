import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar__brandPanel">
        <img className="navbar__logo" src="/public/Ellipse 1.svg" alt="FoodLoop Logo" />
        <div className="navbar__brand">
          <div className="navbar__brandName">
            <span>
              <span className="navbar__brandNamePrimary">Food</span>
              <span className="navbar__brandNameSecondary">Loop</span>
            </span>
          </div>
          <div className="navbar__tagline">Zero Waste. Infinite Impact</div>
        </div>
      </div>
      <div className="navbar__nav">
        <a href="/" className="navbar__navLink navbar__navLink--home">Home</a>
        <a href="/about" className="navbar__navLink navbar__navLink--about">About us</a>
        <a href="/contact" className="navbar__navLink navbar__navLink--contact">Contact us</a>
      </div>
      <div className="navbar__loginButton">
        <a href="/login" className="navbar__loginText">Login</a>
        <img className="navbar__loginIcon" src="/public/Arrow right.svg" alt="Arrow right" />
      </div>
    </div>
  );
}
export default Navbar;
