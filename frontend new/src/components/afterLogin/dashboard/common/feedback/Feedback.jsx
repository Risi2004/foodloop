import icon1 from "../../../../../assets/icons/afterLogin/feedback/send.svg"
import './Feedback.css'

function Feedback() {
    return (
        <div className='feedback'>
            <h1>Tell us what you think about FoodLoop</h1>
            <textarea name="" id="" placeholder='Join our tiered donor program and showcase your commitment to the circular economy.'></textarea> <br />
            <button>
                <h3>Send</h3>
                <img src={icon1} alt="send" />
            </button>
        </div>
    )
}

export default Feedback;