import vehicleIcon from "../../../../../assets/icons/afterLogin/driver/scooter.svg";
import profileIcon from "../../../../../assets/icons/afterLogin/driver/profile.svg"
import './DriverDetails.css';

function DriverDetails() {
    return (
        <div className='driver__details'>
            <div className='driver__details__s1'>
                <div className="driver__details__s1__sub1">
                    <img src={vehicleIcon} alt="Vehicle" />
                    <div className="driver__details__s1__sub1__sub">
                        <h5>Current Location</h5>
                        <p>0.8 mi to recipient (Central Community Center)</p>
                    </div>
                </div>
                <div className="driver__details__s1__sub2">
                    <img src={profileIcon} alt="Profile-Icon" />
                    <p>Sarah J.</p>
                </div>
            </div>
            <div className="driver__details__s2">
                <div className="driver__details__s2__sub1">
                    <img src={vehicleIcon} alt="Vehicle" />
                    <div className="driver__details__s1__sub1__sub">
                        <h5>Vehicle Type</h5>
                        <p>Scooter</p>
                    </div>
                </div>
                <div className="driver__details__s1__sub2">
                    <h5>Vehicle Number</h5>
                    <p>BYD - 2956</p>
                </div>
            </div>
        </div>
    )
}


export default DriverDetails;