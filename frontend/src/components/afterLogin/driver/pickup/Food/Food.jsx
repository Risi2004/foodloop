import foodImage from "../../../../../assets/images/driver/food-image.svg";
import foodIcon from "../../../../../assets/icons/afterLogin/driver/organic-food.svg"
import './Food.css';

function Food (){
    return(
        <div className='food'>
            <img src={foodImage} alt="Food-Image" />
            <div className="food__s1">
                <h2>Avacado Toast (6Pcs)</h2>
                <p>Claimed by Driver Alex</p>
                <div className="food__s1__sub">
                    <img src={foodIcon} alt="Food" />
                    <p>6pcs Available</p>
                </div>
            </div>
        </div>
    )
}

export default Food;