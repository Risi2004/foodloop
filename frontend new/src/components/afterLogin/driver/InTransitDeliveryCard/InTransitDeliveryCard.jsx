import { Link } from 'react-router-dom';
import swapIcon from "../../../../assets/icons/afterLogin/driver/Swap.svg";
import dotIcon from "../../../../assets/icons/afterLogin/driver/dot.svg";
import scheduleIcon from "../../../../assets/icons/afterLogin/driver/schedule.svg"
import './InTransitDeliveryCard.css';

function InTransitDeliveryCard() {
    return (
        <div className='transit__delivery__card'>
            <div className='transit__delivery__card__s1'>
                <div className='transit__delivery__card__s1__sub'>
                    <div className='transit__delivery__card__s1__sub1'>
                        <img src={dotIcon} alt="Dot - Icon" />
                        <h4>In Transit</h4>
                    </div>
                    <div className='transit__delivery__card__s1__sub2'>
                        <img src={swapIcon} alt="" />
                        <Link><h4>Follow Map</h4></Link>
                    </div>
                </div>
                <div className='transit__delivery__card__s1__sub3'>
                    <h3>Fresh Bakers</h3>
                    <p>0.5 km Away</p>
                </div>
                <div className='transit__delivery__card__s1__sub4'>
                    <p>Assorted Pastries • 4.2 kg</p>
                    <div className='transit__delivery__card__s1__sub4__sub'>
                        <img src={scheduleIcon} alt="Schedule-Icon" />
                        <p style={{color:"#EF4444"}}>Delivered in 15 min</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InTransitDeliveryCard;