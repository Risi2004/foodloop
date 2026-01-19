import Navbar from "../../../components/beforeLogin/navbar/Navbar"
import HeaderImage from "../../../components/beforeLogin/headerImage/HeaderImage"
import "./LandingPage.css"

function LandingPage() {
    return (
        <div className="landing__page">
            <Navbar />
            <HeaderImage />
        </div>
    )
}

export default LandingPage