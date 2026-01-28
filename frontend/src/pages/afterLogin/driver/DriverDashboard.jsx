import FunctionsSection from '../../../components/afterLogin/dashboard/driverSection/functionsSection/FunctionsSection';
import Header from '../../../components/afterLogin/dashboard/driverSection/header/Header';
import DriverNavbar from '../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar';
import Feedback from "../../../components/afterLogin/dashboard/common/feedback/Feedback"
import Map from "../../../components/afterLogin/dashboard/driverSection/map/DriverMap"
import Contact from "../../../components/beforeLogin/Contact/Contact"
import StatusBatch from "../../../components/afterLogin/dashboard/driverSection/driverStatusBatch/DriverStatusBatch"
import DriverFooter from "../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter"
import './DriverDashboard.css'

function DriverDashboard(){
    return (
        <div className='driver__dashboard'>
            <DriverNavbar />
            <Header />
            <FunctionsSection />
            <Feedback />
            <Map />
            <StatusBatch />
            <Contact />
            <DriverFooter />
        </div>
    )
}

export default DriverDashboard;