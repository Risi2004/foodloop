import ReviewCards from './ReviewCards';
import './ReviewSection.css'
import profileIcon from "../../../assets/icons/review/profile.svg"

const reviews = [
    { id: 1, name: "Vijay", role: "DONOR", text: "Food Loop is an amazing initiative. Donating excess food was simple." },
    { id: 2, name: "Anita S.", role: "DRIVER", text: "Being part of the distribution team has been the most fulfilling experience." },
    { id: 3, name: "Grand Hotel", role: "DONOR", text: "We drastically reduced our food waste thanks to their efficient pickup system." },
    { id: 4, name: "Suresh K.", role: "DRIVER", text: "The app makes navigation to pickup points seamless and quick." },
    { id: 5, name: "Meera R.", role: "DONOR", text: "I love transparency. Knowing exactly where my donation went is priceless." },
    { id: 6, name: "City Bakery", role: "DONOR", text: "Finally a reliable way to ensure our unsold bread helps the community." },
    { id: 7, name: "Rahul T.", role: "RECEIVER", text: "Connecting donors to those in need—Food Loop bridges the gap perfectly." },
    { id: 8, name: "Community Kitchen", role: "RECEIVER", text: "The consistent supply of fresh vegetables has helped us feed hundreds more." },
    { id: 9, name: "Priya M.", role: "DONOR", text: "Super intuitive application. It took me 2 minutes to list my donation." },
    { id: 10, name: "Arun D.", role: "DRIVER", text: "Every trip feels meaningful. This platform is a game changer." },
    { id: 11, name: "Kavya L.", role: "DONOR", text: "A wonderful way to share blessings on special occasions like birthdays." },
    { id: 12, name: "Green Grocers", role: "DONOR", text: "Zero waste goal is now achievable. Highly recommend Food Loop." },
    { id: 13, name: "Vikram S.", role: "DRIVER", text: "Seeing the smiles on children's faces when we deliver is everything." },
    { id: 14, name: "Sarah J.", role: "DONOR", text: "Effective, transparent, and impactful. Keep up the great work!" },
    { id: 15, name: "Noor F.", role: "RECEIVER", text: "We are grateful for the support. It makes a huge difference in our daily supplies." },
    { id: 16, name: "Rajesh P.", role: "DRIVER", text: "Proud to use my weekends to drive for such a noble cause." },
    { id: 17, name: "Spice Garden", role: "DONOR", text: "The pickup team is always professional and punctual." },
    { id: 18, name: "Deepa N.", role: "RECEIVER", text: "It's not just about food, it's about sharing hope." },
    { id: 19, name: "John D.", role: "DONOR", text: "My restaurant feels better knowing nothing goes to the bin unnecessarily." },
    { id: 20, name: "Helping Hands", role: "RECEIVER", text: "Food Loop is a lifeline for our shelter. Thank you!" },
];

function ReviewSection() {
    const leftReviews = reviews.slice(0, 10);
    const rightReviews = reviews.slice(10, 20);

    const leftScrollItems = [...leftReviews, ...leftReviews];
    const rightScrollItems = [...rightReviews, ...rightReviews];
    const allScrollItems = [...reviews, ...reviews];

    return (
        <div className='review__section'>
            <div className="review__header">
                <h1>What Our Community Says</h1>
                <p>Hear from the people who make the loop possible—donors, volunteers, and partners.</p>
            </div>

            <div className="review__scroll-container">
                <div className="review__column review__column--left">
                    <div className="review__track track-up">
                        {leftScrollItems.map((review, index) => (
                            <ReviewCards
                                key={`l-${review.id}-${index}`}
                                name={review.name}
                                role={review.role}
                                reviewText={review.text}
                                image={profileIcon}
                            />
                        ))}
                    </div>
                </div>

                <div className="review__column review__column--right">
                    <div className="review__track track-down">
                        {rightScrollItems.map((review, index) => (
                            <ReviewCards
                                key={`r-${review.id}-${index}`}
                                name={review.name}
                                role={review.role}
                                reviewText={review.text}
                                image={profileIcon}
                            />
                        ))}
                    </div>
                </div>

                <div className="review__column review__column--mobile">
                    <div className="review__track track-up">
                        {allScrollItems.map((review, index) => (
                            <ReviewCards
                                key={`m-${review.id}-${index}`}
                                name={review.name}
                                role={review.role}
                                reviewText={review.text}
                                image={profileIcon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewSection;