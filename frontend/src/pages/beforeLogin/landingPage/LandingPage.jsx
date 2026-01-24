import Navbar from "../../../components/beforeLogin/navbar/Navbar"
import HeaderImage from "../../../components/beforeLogin/headerImage/HeaderImage"
import StatsCardPage from "../../../components/beforeLogin/statsCardPage/StatsCardPage"
import About from "../../../components/beforeLogin/aboutSection/About"
import "./LandingPage.css"

function LandingPage() {
    return (
        <div className="landing__page">
            <Navbar />
            <HeaderImage /> 
            <StatsCardPage />
            <About />
        </div>
    )
}

export default LandingPage