import About from "../../../../components/afterLogin/about/About";
import ReceiverNavbar from "../../../../components/afterLogin/dashboard/receiverSection/navbar/ReceiverNavbar"
import ReceiverFooter from "../../../../components/afterLogin/dashboard/receiverSection/footer/ReceiverFooter";

function ReceiverAbout() {
    return (
        <div className="receiver__about__page">
            <ReceiverNavbar />
            <About />
            <ReceiverFooter />
        </div>
    )
}

export default ReceiverAbout;