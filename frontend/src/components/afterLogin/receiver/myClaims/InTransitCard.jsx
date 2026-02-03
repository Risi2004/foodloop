import foodImage from "../../../../assets/icons/afterLogin/receiver/img.png";
import organicFoodIcon from "../../../../assets/icons/afterLogin/receiver/Organic Food.svg";
import swapIcon from "../../../../assets/icons/afterLogin/receiver/Swap.svg";
import './MyClaimsCards.css';
import { useNavigate } from 'react-router-dom';

const InTransitCard = () => {
    const navigate = useNavigate();
    const handleFollowMapClick = () => {
        navigate("/track");
    };

    return (
        <div className="donation-card">
            <div className="top">
                <div className="div-flex">
                    <div className="span-bg-blue-100">
                        <div className="span-size-1-5"></div>
                        <div className="in-transit">In Transit</div>
                    </div>
                </div>
                <div className="tool">
                    <div className="edit" onClick={handleFollowMapClick}>
                        <img className="swap" src={swapIcon} alt="Follow map" />
                        <div className="supplied">Follow Map</div>
                    </div>
                </div>
            </div>
            <div className="fed">
                <img className="img" src={foodImage} alt="Avocado Toast" />
                <div className="detail">
                    <div className="name">
                        <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                        <div className="listed-2-mins-ago">Claimed by Driver #402</div>
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

export default InTransitCard;
