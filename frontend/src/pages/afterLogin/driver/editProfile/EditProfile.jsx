import DriverNavbar from "../../../../components/afterLogin/dashboard/driverSection/navbar/DriverNavbar";
import DriverFooter from "../../../../components/afterLogin/dashboard/driverSection/footer/DriverFooter";
import profileIcon from "../../../../assets/icons/afterLogin/driver/account.svg";
import changeIcon from "../../../../assets/icons/afterLogin/driver/camera.svg";
import lockIcon from "../../../../assets/icons/afterLogin/driver/Lock.svg";
import memberIcon from "../../../../assets/icons/afterLogin/driver/Customer.svg";
import './EditProfile.css';

function EditProfile() {
    return (
        <>
            <DriverNavbar />
            <div className='edit__profile'>
                <h1>Edit Profile</h1>
                <p>Manage your public profile and personal preferences.</p>
                <div className="edit__profile__s1">
                    <div className='edit__profile__s1__sub1'>
                        <div className="edit__profile__s1__sub1__sub">
                            <img className="profile" src={profileIcon} alt="Profile-Icon" />
                            <img className="change" src={changeIcon} alt="Change" />
                        </div>
                        <h5>Driver</h5>
                        <h3>Alex Johnson</h3>
                        <p>Member Since Oct 2025</p>
                        <button>
                            <img src={lockIcon} alt="Lock" />
                            <h4>Change Password</h4>
                        </button>
                    </div>
                    <div className="edit__profile__s1__sub2">
                        <div className="edit__profile__s1__sub2__sub1">
                            <img src={memberIcon} alt="Personal-Information" />
                            <h2>Personal Information</h2>
                        </div>
                        <div className="edit__profile__s1__sub2__sub2">
                            <div className="edit__profile__s1__sub2__sub2__sub">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" />
                            </div>
                            <div className="edit__profile__s1__sub2__sub2__sub">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" />
                            </div>
                        </div>
                        <div className="edit__profile__s1__sub2__sub3">
                            <label htmlFor="contact">Contact Number</label>
                            <input type="tel" name="contact" id="contact" />
                        </div>
                        <div className="edit__profile__s1__sub2__sub4">
                            <label htmlFor="address">Address</label>
                            <input type="text" name="address" id="address" />
                        </div>
                        <button className="cancel">Cancel</button>
                        <button className="save">Save</button>
                    </div>
                </div>

            </div>
            <DriverFooter />
        </>
    )
}

export default EditProfile;