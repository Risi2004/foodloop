import DriverNavbar from '../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar';
import DriverFooter from '../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter';
import truckIcon from "../../../../assets/icons/afterLogin/driver/Truck.svg";
import trendIcon from "../../../../assets/icons/afterLogin/driver/Trend-Up.svg";
import swapIcon from "../../../../assets/icons/afterLogin/driver/Swap.svg";
import trophyIcon from "../../../../assets/icons/afterLogin/driver/Trophy.svg";
import starIcon from "../../../../assets/icons/afterLogin/driver/Mandriva.svg";
import './MyPickups.css';
import InTransitDeliveryCard from '../../../../components/afterLogin/driver/InTransitDeliveryCard/InTransitDeliveryCard';
import DeliveredCard from "../../../../components/afterLogin/driver/profile/DeliveredCard"

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
                    <div className='driver__profile__s2__sub1__sub3'>
                        <div className='driver__profile__s2__sub1__sub3__sub1'>
                            <h3>Your Impact Progress</h3>
                            <div className='driver__profile__s2__sub1__sub3__sub1__badge'>
                                <img src={trophyIcon} alt="trophy" />
                                <p>Community Hero</p>
                            </div>
                        </div>
                        <div className='driver__profile__s2__sub1__sub3__sub2'>
                            <img src={starIcon} alt="star" />
                            <div className='driver__profile__s2__sub1__sub3__sub2__sub'>
                                <div className='driver__profile__s2__sub1__sub3__sub2__sub__text'>
                                    <p>12/15 Pickups Completed</p>
                                    <p>80%</p>
                                </div>
                                <div className='driver__profile__s2__sub1__sub3__sub2__sub__bar'>
                                    <div className='driver__profile__s2__sub1__sub3__sub2__sub__bar__fill'></div>
                                </div>
                            </div>
                        </div>
                        <p className="driver__profile__s2__sub1__sub3__p">"Just 3 more pickups to earn your next badge!"</p>
                    </div>
                </div>

                <div className='my__pickups__s2'>

                    <div className='my__pickups__s2__sub1'>
                        <h1>In Transit Pickups</h1>
                        <div className="my__pickups__s2__sub1__cards">
                            <InTransitDeliveryCard />
                            <InTransitDeliveryCard />
                        </div>
                    </div>
                    <div className='my__pickups__s2__sub2'>
                        <h1>Completed History</h1>
                        <div className='my__pickups__s2__sub2__sub'>
                            <DeliveredCard />
                            <DeliveredCard />
                        </div>

                    </div>
                </div>
            </div>
            <DriverFooter />
        </>
    )
}

export default MyPickups;