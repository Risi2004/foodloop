import Feedback from "../../../../components/afterLogin/dashboard/common/feedback/Feedback";
import DonorNavbar from "../../../../components/afterLogin/dashboard/donorSection//navbar/DonorNavbar";
import FunctionsSection from "../../../../components/afterLogin/dashboard/donorSection/functionsSection/functionsSection";
import Header from "../../../../components/afterLogin/dashboard/donorSection/header/Header"
import Map from "../../../../components/afterLogin/dashboard/donorSection/map/DonorMap"
import Contact from "../../../../components/beforeLogin/Contact/Contact"
import DonorFooter from "../../../../components/afterLogin/dashboard/donorSection/footer/DonorFooter"
import "./DonorDashboard.css";
import StatusBatchCard from "../../../../components/afterLogin/dashboard/common/statusBatchCard/StatusBatchCard";

function DonorDashboard() {
    return (
        <div className="dashboard__page">
            <DonorNavbar />
            <Header />
            <FunctionsSection />
            <Feedback />
            <Map />
            <StatusBatchCard/>
            <Contact />
            <DonorFooter />
        </div>
    )
}

export default DonorDashboard;