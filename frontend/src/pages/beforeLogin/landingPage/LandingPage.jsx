import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "../../../components/beforeLogin/navbar/Navbar"
import HeaderImage from "../../../components/beforeLogin/headerImage/HeaderImage"
import StatsCardPage from "../../../components/beforeLogin/statsCardPage/StatsCardPage"
import About from "../../../components/beforeLogin/aboutSection/About"
import TransparencyLoopCardSection from "../../../components/beforeLogin/transparencyLoopCardSection/TransparencyLoopCardSection"
import Map from "../../../components/beforeLogin/map/Map"
import ReviewSection from "../../../components/beforeLogin/review/ReviewSection"
import Contact from "../../../components/beforeLogin/Contact/Contact"
import Chatbot from "../../../components/chatbot/Chatbot"
import Footer from "../../../components/beforeLogin/footer/Footer"
import "./LandingPage.css"

function LandingPage() {
    const location = useLocation()

    useEffect(() => {
        const hash = location.hash?.slice(1)
        if (hash) {
            const el = document.getElementById(hash)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [location.pathname, location.hash])

    return (
        <div className="landing__page">
            <Navbar />
            <Chatbot />
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