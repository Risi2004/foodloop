import foodImage from "../../../../assets/icons/afterLogin/receiver/img.png";
import organicFoodIcon from "../../../../assets/icons/afterLogin/receiver/Organic Food.svg";
import './MyClaimsCards.css';

const LookingForDriverCard = () => {
    return (
        <div className="donation-card">
            <div className="top">
                <div className="div-flex">
                    <div className="span-bg-orange-100">
                        <div className="span-size-1-5-orange"></div>
                        <div className="in-transit-orange">Looking for Driver</div>
                    </div>
                </div>
            </div>
            <div className="fed">
                <img className="img" src={foodImage} alt="Avocado Toast" />
                <div className="detail">
                    <div className="name">
                        <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                        <div className="listed-2-mins-ago">Listed 2 mins ago</div>
                        <div className="listed-2-mins-ago">EXP: 08/2026</div>
                    </div>
                    <div className="wight">
                        <div className="wight2">
                            <img
                                className="organic-food"
                                src={organicFoodIcon}
                                alt="Organic food"
                            />
                            <div className="_5-kg-available">
                                <span>
                                    <span className="_5-kg-available-span">6pcs</span>
                                    <span className="_5-kg-available-span2">Available</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LookingForDriverCard;
