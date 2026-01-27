import icon1 from '../../../assets/icons/contact/1.svg'
import icon2 from '../../../assets/icons/contact/2.svg'
import icon3 from '../../../assets/icons/contact/3.svg'
import './Contact.css'

function Contact() {
    return (
        <div className='contact'>
            <div className='contact__s1'>
                <div className='contact__s1__sub1'>
                    <img src={icon3} alt="mail-icon" />
                    <h5>Get In Touch</h5>
                </div>
                <h1>We'd Love To Hear From You</h1>
                <p style={{ marginBottom: "40px" }}>Have a question about the transparency loop? Want to partner with us? or just want to say hi? Drop us a message.</p>
                <div className='contact__s1__sub2'>
                    <div className='contact__s1__sub2__sub'>
                        <img src={icon1} alt="email-icon" />
                        <div className='contact__s1__sub2__sub__sub'>
                            <h3>Email Us</h3>
                            <p>Our friendly team is here to help.</p>
                            <h5 style={{ color: "#1F4E36" }}>foodloop.official@gmail.com</h5>                        </div>
                    </div>
                    <div className='contact__s1__sub2__sub'>
                        <img src={icon2} alt="location-icon" />
                        <div className='contact__s1__sub2__sub__sub'>
                            <h3>Visit Us</h3>
                            <p>Come say hello at our office HQ.</p>
                            <h5>381 Nawala Road</h5>
                            <h5>Colombo, Sri Lanka</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className='contact__s2'>
                <div className='contact__s2__sub1'>
                    <div className='contact__s2__sub__sub'>
                        <label htmlFor="name">Name</label>
                        <input type="text" id='name' placeholder='John Doe' />
                    </div>
                    <div className='contact__s2__sub__sub'>
                        <label htmlFor="email">Email</label>
                        <input type="email" id='email' placeholder='johndoe@gmail.com' />
                    </div>
                </div>
                <div className='contact__s2__sub2'>
                    <label htmlFor="subject">Subject</label> <br />
                    <input type="text" id='subject' placeholder='General Inquiry' />
                </div>
                <div className='contact__s2__sub2'>
                    <label htmlFor="message" >Message</label> <br />
                    <textarea id='message' placeholder='How can we help you?' ></textarea>
                </div>
                <button>Send Message</button>
            </div>
        </div>
    )
}

export default Contact