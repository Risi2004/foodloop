import { useState } from 'react';
import ReceiverNavbar from "../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar";
import ReceiverFooter from "../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter";
import breakableIcon from "../../../../assets/icons/afterLogin/receiver/Breakable.svg";
import peopleIcon from "../../../../assets/icons/afterLogin/receiver/People.svg";
import swapIcon from "../../../../assets/icons/afterLogin/receiver/Swap.svg";
import gassIcon from "../../../../assets/icons/afterLogin/receiver/Gas Industry.svg";
import image from "../../../../assets/icons/afterLogin/receiver/img.png";
import organicIcon from "../../../../assets/icons/afterLogin/receiver/Organic Food.svg";
import scooterIcon from "../../../../assets/icons/afterLogin/receiver/Delivery Scooter.svg";
import image2 from "../../../../assets/icons/afterLogin/receiver/Image.svg";
import './ReceiptForm.css';

const ReceiptForm = () => {
    const [dropLocation, setDropLocation] = useState('Eg:- 0.8 mi to recipient (Central Community Center)');
    const [peopleFed, setPeopleFed] = useState('Eg:- 20Peoples');

    return (
        <>

            <ReceiverNavbar />
            <div className="receipt-form">
                <h1>Update the <br />Details</h1>
                <div className="form">
                    <h2>Fill form</h2>
                    <div className="inputs">
                        <div className="current-loc">
                            <div className="point">
                                <div className="frame-23">
                                    <img className="breakable" src={breakableIcon} alt="location" />
                                </div>
                            </div>
                            <div className="div">
                                <div className="current-location">Drop Location</div>
                                <div className="frame-193">
                                    <input
                                        type="text"
                                        className="_0-8-mi-to-recipient"
                                        value={dropLocation}
                                        onChange={(e) => setDropLocation(e.target.value)}
                                        placeholder="Eg:- 0.8 mi to recipient (Central Community Center)"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="frame-194">
                            <div className="frame-104">
                                <img className="people" src={peopleIcon} alt="people" />
                            </div>
                            <div className="div">
                                <div className="current-location">People Fed</div>
                                <div className="frame-193">
                                    <input
                                        type="text"
                                        className="_0-8-mi-to-recipient"
                                        value={peopleFed}
                                        onChange={(e) => setPeopleFed(e.target.value)}
                                        placeholder="Eg:- 20Peoples"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="info">
                <div className="infotop">
                    <div className="donor-information">
                        <div className="donor-information2">Donor Information</div>
                        <div className="sarah-jenkins">Sarah Jenkins</div>
                        <div className="sarah-j-impact-com">sarah.j@impact.com</div>
                    </div>
                    <div className="handling-organizatio">
                        <div className="handling-organizatio2">Handling Organization</div>
                        <div className="community-harvest-ng">Community Harvest NGO</div>
                        <div className="delivered-oct-24-2">Delivered: Oct 24, 2023</div>
                        <div className="current-loc">
                            <div className="point">
                                <div className="frame-23">
                                    <img className="breakable" src={breakableIcon}alt="location" />
                                </div>
                            </div>
                            <div className="div">
                                <div className="current-location">Drop Location</div>
                                <div className="_0-8-mi-to-recipient">
                                    0.8 mi to recipient (Central Community Center)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cards">
                    <div className="card">
                        <header className="icon-wrapper">
                            <img src={swapIcon} alt="distance" />
                        </header>
                        <div className="cardtxt">
                            <h3>Distance Traveled</h3>
                            <p>2<span>KM</span></p>
                        </div>
                    </div>
                    <div className="card">
                        <header className="icon-wrapper">
                            <img src={peopleIcon} alt="distance" />
                        </header>
                        <div className="cardtxt">
                            <h3>People Fed</h3>
                            <p>18</p>
                        </div>
                    </div>
                    <div className="card">
                        <header className="icon-wrapper">
                            <img src={gassIcon} alt="distance" />
                        </header>
                        <div className="cardtxt">
                            <h3>Methane Saved</h3>
                            <p>0.5<span>KM</span></p>
                        </div>
                    </div>
                </div>
                <section className="delivery-section">
                    <header className="delivery-head">
                        <h2>Food Information</h2>
                        <h2>Driver Information</h2>
                    </header>

                    <section className="delivery-body">
                        <article className="food-card" aria-label="Food details">
                            <img src={image} alt="Food item" />

                            <section>
                                <header>
                                    <h3>Avocado Toast (6pcs)</h3>
                                    <p>Claimed by Driver #402</p>
                                </header>

                                <footer className="food-meta">
                                    <img src={organicIcon} alt="organic" />
                                    <p>
                                        <strong>6pcs</strong> <span>Available</span>
                                    </p>
                                </footer>
                            </section>
                        </article>

                        <article className="driver-card" aria-label="Driver details">
                            <section className="driver-row" aria-label="Current location and driver">
                                <div className="driver-left">
                                    <span className="driver-badge" aria-hidden="true">
                                        <span className="driver-badge__inner">
                                            <img src={scooterIcon} alt="scooter" />
                                        </span>
                                    </span>

                                    <dl>
                                        <dt>Current Location</dt>
                                        <dd>0.8 mi to recipient (Central Community Center)</dd>
                                    </dl>
                                </div>

                                <div className="driver-right" aria-label="Driver identity">
                                    <img src={image2} alt="Driver avatar" />
                                    <p>Sarah J. (Volunteer)</p>
                                </div>
                            </section>

                            <section className="driver-row" aria-label="Vehicle details">
                                <div className="driver-left">
                                    <img className="driver-vehicle-icon" src={scooterIcon} alt="" aria-hidden="true" />
                                    <dl>
                                        <dt>Vehicle Type</dt>
                                        <dd>Scooter</dd>
                                    </dl>
                                </div>

                                <dl className="driver-right driver-right--stack">
                                    <dt>Vehicle Number</dt>
                                    <dd>BYD - 2418</dd>
                                </dl>
                            </section>
                        </article>
                    </section>
                </section>

                <footer className="info-actions">
                    <button type="button" className="save-btn">Save</button>
                </footer>
            </div>
            <ReceiverFooter />
        </>
    );
}
export default ReceiptForm;