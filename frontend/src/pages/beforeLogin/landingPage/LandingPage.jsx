import Navbar from "../../../components/beforeLogin/navbar/Navbar"
import HeaderImage from "../../../components/beforeLogin/headerImage/HeaderImage"
import StatsCardPage from "../../../components/beforeLogin/statsCardPage/StatsCardPage"
import About from "../../../components/beforeLogin/aboutSection/About"
import TransparencyLoopCardSection from "../../../components/beforeLogin/transparencyLoopCardSection/TransparencyLoopCardSection"
import Map from "../../../components/beforeLogin/map/Map"
import ReviewSection from "../../../components/beforeLogin/review/ReviewSection"
import Contact from "../../../components/beforeLogin/Conatct/Contact"
import Footer from "../../../components/beforeLogin/footer/Footer"
import "./LandingPage.css"

function LandingPage() {
    return (
        <div className="landing__page">
            <Navbar />
            <HeaderImage /> 
            <StatsCardPage />
            <About />
            <TransparencyLoopCardSection />
            <Map />
            <ReviewSection />
            <Contact />
            <Footer />
        </div>
    )
}

export default LandingPage