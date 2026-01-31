import { Link } from 'react-router-dom';
import DriverNavbar from "../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar";
import DriverFooter from "../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter";
import profileIcon from "../../../../assets/icons/afterLogin/driver/profile.svg"
import verifyIcon from "../../../../assets/icons/afterLogin/driver/verify.svg"
import validationIcon from "../../../../assets/icons/afterLogin/driver/validation.svg"
import customerIcon from "../../../../assets/icons/afterLogin/driver/Customer.svg"
import warrantyIcon from "../../../../assets/icons/afterLogin/driver/Warranty.svg"
import fastIcon from "../../../../assets/icons/afterLogin/driver/Exercise.svg"
import centuryIcon from "../../../../assets/icons/afterLogin/driver/Facebook-Like.svg"
import bestIcon from "../../../../assets/icons/afterLogin/driver/Quality.svg"
import truckIcon from "../../../../assets/icons/afterLogin/driver/Truck.svg"
import trendIcon from "../../../../assets/icons/afterLogin/driver/Trend-Up.svg"
import swapIcon from "../../../../assets/icons/afterLogin/driver/Swap.svg"
import mealIcon from "../../../../assets/icons/afterLogin/driver/Meal.svg"
import DeliveredCard from '../../../../components/afterLogin/driver/profile/DeliveredCard';
import trophyIcon from "../../../../assets/icons/afterLogin/driver/Trophy.svg";
import starIcon from "../../../../assets/icons/afterLogin/driver/Mandriva.svg";
import "./DriverProfile.css";

function DriverProfile() {
    return (
        <>
            <DriverNavbar />

            <div className="driver__profile__page">
                <div className="driver__profile__s1">
                    <div className='driver__profile__s1__sub1'>
                        <img src={profileIcon} alt="profile" />
                        <div className='driver__profile__s1__sub1__sub'>
                            <h1>Alex</h1>
                            <p>Volunteer Driver • Joined May 2023</p>
                            <Link to="/driver/edit-profile"><button>Edit</button></Link>
                        </div>
                    </div>
                    <div className='driver__profile__s1__sub2'>
                        <div className='driver__profile__s1__sub2__sub1'>
                            <img src={verifyIcon} alt="verification" />
                            <h5>Verification</h5>
                        </div>
                        <div className='driver__profile__s1__sub2__sub2'>
                            <img src={validationIcon} alt="validation" />
                            <div className='driver__profile__s1__sub2__sub2__sub'>
                                <h2>NIC Verified</h2>
                                <p>Identity Confirmed</p>
                            </div>
                        </div>
                        <div className='driver__profile__s1__sub2__sub2'>
                            <img src={validationIcon} alt="validation" />
                            <div className='driver__profile__s1__sub2__sub2__sub'>
                                <h2>License Valid</h2>
                                <p>Class B Driver License</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='driver__profile__s2'>
                    <div className='driver__profile__s2__sub1'>
                        <div className='driver__profile__s2__sub1__sub1'>
                            <div className='driver__profile__s2__sub1__sub1__sub'>
                                <img src={customerIcon} alt="Customer-Icon" />
                                <h2>Personal Information</h2>
                            </div>
                            <h3>Email</h3>
                            <p>john.doe@gnail.com</p>
                            <h3>Contact No</h3>
                            <p>0758626485</p>
                            <h3>Address</h3>
                            <p>123 Sustainability Way, Colombo, EC 5021</p>
                        </div>
                        <div className='driver__profile__s2__sub1__sub2'>
                            <div className='driver__profile__s2__sub1__sub2__sub1'>
                                <img src={warrantyIcon} alt="Customer-Icon" />
                                <h2>Achievements & Badges</h2>
                            </div>
                            <div className='driver__profile__s2__sub1__sub2__sub2'>
                                <div className='driver__profile__s2__sub1__sub2__sub2__sub'>
                                    <img src={fastIcon} alt="" />
                                    <h4>Faster</h4>
                                </div>
                                <div className='driver__profile__s2__sub1__sub2__sub2__sub'>
                                    <img src={centuryIcon} alt="" />
                                    <h4>Centurion</h4>
                                </div>
                                <div className='driver__profile__s2__sub1__sub2__sub2__sub'>
                                    <img src={bestIcon} alt="" />
                                    <h4>Best</h4>
                                </div>
                            </div>
                            <div className='driver__profile__s2__sub1__sub2__sub2'>

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
                    <div className='driver__profile__s2__sub2'>
                        <div className='driver__profile__s2__sub2__sub1'>
                            <div className='driver__profile__s2__sub2__sub1__sub'>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub1'>
                                    <h5>Deliveries Completed</h5>
                                    <img src={truckIcon} alt="truck" />
                                </div>
                                <h1>124</h1>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub2'>
                                    <img src={trendIcon} alt="trend" />
                                    <p>+12% this month</p>
                                </div>
                            </div>
                            <div className='driver__profile__s2__sub2__sub1__sub'>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub1'>
                                    <h5>Distance Travelled</h5>
                                    <img src={swapIcon} alt="truck" />
                                </div>
                                <h1>124</h1>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub2'>
                                    <img src={trendIcon} alt="trend" />
                                    <p>+12% this month</p>
                                </div>
                            </div>
                            <div className='driver__profile__s2__sub2__sub1__sub'>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub1'>
                                    <h5>Meals Saved</h5>
                                    <img src={mealIcon} alt="meal" />
                                </div>
                                <h1>124</h1>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub2'>
                                    <img src={trendIcon} alt="trend" />
                                    <p>+12% this month</p>
                                </div>
                            </div>
                        </div>
                        <div className='driver__profile__s2__sub2__sub2'>
                            <div className='driver__profile__s2__sub2__sub2__sub1'>
                                <h2>Recent Missions</h2>
                                <p>View All</p>
                            </div>
                            <div className='driver__profile__s2__sub2__sub2__sub2'>
                                <DeliveredCard />
                                <DeliveredCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DriverFooter />
        </>
    )

}

export default DriverProfile;