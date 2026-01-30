import DriverNavbar from '../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar';
import DriverFooter from '../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter';
import truckIcon from "../../../../assets/icons/afterLogin/driver/Truck.svg"
import trendIcon from "../../../../assets/icons/afterLogin/driver/Trend-Up.svg"
import swapIcon from "../../../../assets/icons/afterLogin/driver/Swap.svg"
import './MyPickups.css';

function MyPickups() {
    return (
        <>
            <DriverNavbar />
            <div className='my__pickups'>
                <div className='my__pickups__s1'>
                    <h1>My Pickups</h1>
                    <div className='my__pickups__s1__sub'>
                        <div className='my__pickups__s1__sub1'>
                            <h5>Deliveries Completed</h5>
                            <img src={truckIcon} alt="truck" />
                        </div>
                        <h1>124</h1>
                        <div className='my__pickups__s1__sub2'>
                            <img src={trendIcon} alt="trend" />
                            <p>+12% this month</p>
                        </div>
                    </div>
                    <div className='my__pickups__s1__sub'>
                        <div className='my__pickups__s1__sub1'>
                            <h5>Distance Travelled</h5>
                            <img src={swapIcon} alt="truck" />
                        </div>
                        <h1>450 Km</h1>
                        <div className='my__pickups__s1__sub2'>
                            <img src={trendIcon} alt="trend" />
                            <p>+12% this month</p>
                        </div>
                    </div>
                </div>

            </div>
            <DriverFooter />
        </>
    )
}

export default MyPickups;