import { useState, useEffect } from 'react';
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
import { getUser } from '../../../../utils/auth';
import { getDriverStatistics, getDriverCompletedDeliveries } from '../../../../services/donationApi';
import "./DriverProfile.css";

function DriverProfile() {
    const [profile, setProfile] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setProfile(getUser());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [statsResponse, completedResponse] = await Promise.all([
                    getDriverStatistics(),
                    getDriverCompletedDeliveries(),
                ]);
                if (statsResponse?.success && statsResponse.statistics) {
                    setStatistics(statsResponse.statistics);
                }
                if (completedResponse?.success && completedResponse.deliveries) {
                    setCompletedDeliveries(completedResponse.deliveries.slice(0, 10));
                }
            } catch (err) {
                console.error('[DriverProfile] Error fetching data:', err);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const joinedDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';
    const displayName = profile?.driverName || profile?.email || 'Driver';
    const vehicleDisplay = profile?.vehicleType
        ? `${profile.vehicleType}${profile?.vehicleNumber ? ` • ${profile.vehicleNumber}` : ''}`
        : (profile?.vehicleNumber ? profile.vehicleNumber : '—');

    const formatTrend = (trend) => {
        if (trend == null || trend === undefined) return '+0%';
        const sign = trend >= 0 ? '+' : '';
        return `${sign}${trend}%`;
    };

    return (
        <>
            <DriverNavbar />

            <div className="driver__profile__page">
                <div className="driver__profile__s1">
                    <div className='driver__profile__s1__sub1'>
                        {profile?.profileImageUrl ? (
                            <img
                                src={profile.profileImageUrl}
                                alt="profile"
                                className="driver__profile__avatar"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = profileIcon;
                                }}
                            />
                        ) : (
                            <img src={profileIcon} alt="profile" />
                        )}
                        <div className='driver__profile__s1__sub1__sub'>
                            <h1>{displayName}</h1>
                            <p>Volunteer Driver{joinedDate ? ` • Joined ${joinedDate}` : ''}</p>
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
                                <p>Driver License</p>
                                <p>{vehicleDisplay}</p>
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
                            <p>{profile?.email ?? '—'}</p>
                            <h3>Contact No</h3>
                            <p>{profile?.contactNo ?? '—'}</p>
                            <h3>Address</h3>
                            <p>{profile?.address ?? '—'}</p>
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
                                    <p>{statistics?.impactProgress?.badgeLevel ?? 'Beginner'}</p>
                                </div>
                            </div>
                            <div className='driver__profile__s2__sub1__sub3__sub2'>
                                <img src={starIcon} alt="star" />
                                <div className='driver__profile__s2__sub1__sub3__sub2__sub'>
                                    <div className='driver__profile__s2__sub1__sub3__sub2__sub__text'>
                                        <p>{statistics?.impactProgress?.currentCount ?? 0}/{statistics?.impactProgress?.nextBadgeTarget ?? 10} Pickups Completed</p>
                                        <p>{statistics?.impactProgress?.progressPercentage ?? 0}%</p>
                                    </div>
                                    <div className='driver__profile__s2__sub1__sub3__sub2__sub__bar'>
                                        <div className='driver__profile__s2__sub1__sub3__sub2__sub__bar__fill' style={{ width: `${Math.min(100, statistics?.impactProgress?.progressPercentage ?? 0)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <p className="driver__profile__s2__sub1__sub3__p">{(statistics?.impactProgress?.remainingForNextBadge ?? 0) > 0 ? `Just ${statistics.impactProgress.remainingForNextBadge} more pickups to earn your next badge!` : 'You reached your current badge target!'}</p>
                        </div>
                    </div>
                    <div className='driver__profile__s2__sub2'>
                        <div className='driver__profile__s2__sub2__sub1'>
                            <div className='driver__profile__s2__sub2__sub1__sub'>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub1'>
                                    <h5>Deliveries Completed</h5>
                                    <img src={truckIcon} alt="truck" />
                                </div>
                                <h1>{loading ? '—' : (statistics?.totalDeliveriesCompleted ?? '—')}</h1>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub2'>
                                    <img src={trendIcon} alt="trend" />
                                    <p>{formatTrend(statistics?.deliveriesTrend)} this month</p>
                                </div>
                            </div>
                            <div className='driver__profile__s2__sub2__sub1__sub'>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub1'>
                                    <h5>Distance Travelled</h5>
                                    <img src={swapIcon} alt="truck" />
                                </div>
                                <h1>{loading ? '—' : (statistics?.totalDistanceTravelledFormatted ?? '—')}</h1>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub2'>
                                    <img src={trendIcon} alt="trend" />
                                    <p>{formatTrend(statistics?.distanceTrend)} this month</p>
                                </div>
                            </div>
                            <div className='driver__profile__s2__sub2__sub1__sub'>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub1'>
                                    <h5>Meals Saved</h5>
                                    <img src={mealIcon} alt="meal" />
                                </div>
                                <h1>{loading ? '—' : (statistics?.totalDeliveriesCompleted ?? '—')}</h1>
                                <div className='driver__profile__s2__sub2__sub1__sub__sub2'>
                                    <img src={trendIcon} alt="trend" />
                                    <p>{formatTrend(statistics?.deliveriesTrend)} this month</p>
                                </div>
                            </div>
                        </div>
                        <div className='driver__profile__s2__sub2__sub2'>
                            <div className='driver__profile__s2__sub2__sub2__sub1'>
                                <h2>Recent Missions</h2>
                                <p>View All</p>
                            </div>
                            <div className='driver__profile__s2__sub2__sub2__sub2'>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : completedDeliveries.length === 0 ? (
                                    <p>No recent missions yet.</p>
                                ) : (
                                    completedDeliveries.slice(0, 2).map((donation) => (
                                        <DeliveredCard key={donation.id} donation={donation} />
                                    ))
                                )}
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