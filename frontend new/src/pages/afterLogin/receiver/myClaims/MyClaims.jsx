import "./Myclaims.css";
import ReceiverNavbar from "../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar";
import ReceiverFooter from "../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter";
import InTransitCard from "../../../../components/afterLogin/receiver/myClaims/InTransitCard";
import LookingForDriverCard from "../../../../components/afterLogin/receiver/myClaims/LookingForDriverCard";
import CompletedHistoryCard from "../../../../components/afterLogin/receiver/myClaims/CompletedHistoryCard";

const Myclaims = () => {
    return (
        <>
            <ReceiverNavbar />
            <div className="myclaims-container">
                <div className="intransit">
                    <h2 className="active-donations">In Transit Donation </h2>
                    <div className="donation-cards">
                        <InTransitCard />
                        <InTransitCard />
                    </div>
                </div>
                <div className="looking">
                    <h2 className="active-donations">Looking for Driver </h2>
                    <div className="donation-cards">
                        <LookingForDriverCard />
                        <LookingForDriverCard />
                        <LookingForDriverCard />
                    </div>
                </div>
                <div className="complited">
                    <h2 className="active-donations" style={{ color: "darkgreen" }}>Completed History </h2>
                    <div className="donation-cards">
                        <CompletedHistoryCard />
                        <CompletedHistoryCard />
                    </div>
                </div>
            </div>
            <ReceiverFooter />
        </>
    );
};

export default Myclaims;


