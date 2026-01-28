import ReceiverNavbar from "../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar"
import Header from "../../../../components/afterLogin/dashboard/ReceiverSection/header/Header";
import Feedback from "../../../../components/afterLogin/dashboard/common/feedback/Feedback"
import Contact from "../../../../components/beforeLogin/Contact/Contact"
import ReceiverFooter from "../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter"
import Map from "../../../../components/afterLogin/dashboard/ReceiverSection/map/ReceiverMap"
import './ReceiverDashboard.css'
import FunctionsSection from "../../../../components/afterLogin/dashboard/ReceiverSection/functionsSection/FunctionsSection";

function ReceiverDashboard() {
    return (
        <div className="receiver__dashboard">
            <ReceiverNavbar />
            <Header />
            <FunctionsSection />
            <Feedback />
            <Map />
            <Contact />
            <ReceiverFooter />
        </div>
    )
}

export default ReceiverDashboard;