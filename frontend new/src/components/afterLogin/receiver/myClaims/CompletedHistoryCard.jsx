import foodImage from "../../../../assets/icons/afterLogin/receiver/img.png";
import organicFoodIcon from "../../../../assets/icons/afterLogin/receiver/Organic Food.svg";
import checkCircleIcon from "../../../../assets/icons/afterLogin/receiver/check_circle.svg";
import receipt from "../../../../assets/icons/afterLogin/receiver/Receipt.svg"
import { Link } from "react-router-dom";
import './MyClaimsCards.css';

const CompletedHistoryCard = () => {

    return (
        <div className="donation-card">
            <div className="top">
                <div className="div-flex">
                    <div className="span-bg-emerald-100">
                        <img
                            className="check-circle"
                            src={checkCircleIcon}
                            alt="Supplied"
                        />
                        <div className="supplied">Supplied</div>
                    </div>
                </div>
                <div className="tool">
                    <Link to="/receiver/digital-receipt">
                        <div className="edit">
                            <img
                                className="receipt"
                                src={receipt}
                                alt="Create receipt"
                            />

                            <div className="supplied2">
                                Create Receipt
                            </div>

                        </div>
                    </Link>
                </div>
            </div>
            <div className="fed">
                <img className="img" src={foodImage} alt="Avocado Toast" />
                <div className="detail">
                    <div className="name">
                        <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                        <div className="listed-2-mins-ago">Delevered by Driver #402</div>
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

export default CompletedHistoryCard;
