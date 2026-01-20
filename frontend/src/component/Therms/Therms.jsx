import React from "react";
import "./Therms.css";

const Therms = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="termsPage">
      <div className="termsPage__backBar common-back-bar common-back-bar--padded">
        <div className="termsPage__back common-back-bar" onClick={handleBackClick}>
          <img
            className="termsPage__backIcon common-back-icon"
            src="/public/Left.svg"
            alt="Back"
          />
          <div className="termsPage__backText common-back-text">Back to</div>
        </div>
      </div>
      <div className="termsPage__content-area common-content-wrapper">
        <div className="termsPage__card common-glass-card">
          <div className="termsPage__header">
            <div className="termsPage__title">Terms &amp; Conditions</div>
            <div className="termsPage__updatedAt">
              Last Updated: January 2026
            </div>
            <div className="termsPage__intro">
              Welcome to FoodLoop. These Terms and Conditions govern your use of
              our platform, which leverages AI technology to facilitate food
              surplus redistribution across Sri Lanka. By accessing our
              services, you agree to comply with these terms to ensure a safe
              and efficient community for reducing food waste.
            </div>
          </div>
          <div className="termsPage__section common-section">
            <div className="termsPage__sectionTitle common-section-title">Acceptance of Terms</div>
            <div className="termsPage__sectionText common-section-text">
              By creating an account or using the FoodLoop platform, you agree
              to be bound by these Terms and Conditions and our Privacy Policy.
              Our AI-driven service connects food donors with receivers
              efficiently to minimize wastage in Sri Lankan communities.
            </div>
          </div>
          <div className="termsPage__section termsPage__section--highlight common-section">
            <div className="termsPage__sectionTitle common-section-title">The FoodLoop Service</div>
            <div className="termsPage__sectionText common-section-text">
              FoodLoop provides a digital marketplace that matches surplus food
              from businesses and individuals with registered receivers. Our AI
              algorithms prioritize delivery based on:
            </div>
            <div className="termsPage__highlightList common-highlight-list">
              <div className="termsPage__highlightItem">
                Proximity between donors and receivers.
              </div>
              <div className="termsPage__highlightItem">
                Urgency and expiration timing of donated items.
              </div>
              <div className="termsPage__highlightItem">
                Historical donation patterns and reliability.
              </div>
            </div>
          </div>
          <div className="termsPage__section common-section">
            <div className="termsPage__sectionTitle common-section-title">User Obligations</div>
            <div className="termsPage__obligations">
              <div className="termsPage__obligationCard common-card-item">
                <div className="termsPage__obligationTitle common-card-title">For Donors</div>
                <div className="termsPage__obligationText common-card-text common-card-text--small">
                  Donors must ensure that all food provided is fit for human
                  consumption and complies with Sri Lankan food safety
                  standards. Accurate descriptions and photos are required for
                  every listing.
                </div>
              </div>
              <div className="termsPage__obligationCard common-card-item">
                <div className="termsPage__obligationTitle common-card-title">With NGOs</div>
                <div className="termsPage__obligationText common-card-text common-card-text--small">
                  Receivers must collect food within the agreed timeframes.
                  Failure to show up for confirmed pickups may result in
                  temporary or permanent suspension of account privileges.
                </div>
              </div>
            </div>
          </div>
          <div className="termsPage__section termsPage__section--compact common-section common-section--compact">
            <div className="termsPage__sectionTitle common-section-title">Food Safety &amp; Liability</div>
            <div className="termsPage__sectionText common-section-text">
              While FoodLoop facilitates the connection, we do not inspect the
              food physically. Users agree that:
            </div>
            <div className="termsPage__highlightList common-highlight-list">
              <div className="termsPage__liabilityPoint">
                FoodLoop is not liable for illness or injury resulting from
                donated items.
              </div>
              <div className="termsPage__platformRole">
                The platform acts solely as a mediator for surplus
                redistribution.
              </div>
              <div className="termsPage__donorResponsibility">
                Donors remain responsible for the quality and safety of their
                donations until pickup.
              </div>
            </div>
          </div>
          <div className="termsPage__section termsPage__section--compact common-section common-section--compact">
            <div className="termsPage__sectionTitle common-section-title">Governing Law</div>
            <div className="termsPage__governingLawText common-section-text">
              These terms shall be governed by and construed in accordance with
              the laws of the Democratic Socialist Republic of Sri Lanka. Any
              disputes shall be subject to the exclusive jurisdiction of the
              courts in Colombo.
            </div>
          </div>
          <div className="termsPage__contact">
            <div className="termsPage__contactLogo"></div>
            <div className="termsPage__contactHeading">Questions or Feedback?</div>
            <div className="termsPage__contactSubtitle">
              Contact our official legal and support team at:
            </div>
            <div className="termsPage__contactRow common-contact-row">
              <div className="termsPage__contactEmail">
                foodloop.official@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Therms;