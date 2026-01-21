import React from 'react';
import './About.css';

const About = () => (
  <section className="about">
    <header className="head">
      <div className="story-badge">
        <div className="dot" />
        <div className="story-badge__label">The Food Loop Story</div>
      </div>
      <div className="hero-title-wrapper">
        <div className="hero-title">Every Meal Has</div>
        <div className="hero-title--accent">A Destiny.</div>
      </div>
      <p className="hero-description">
        We ensure that destiny is fulfillment, not waste. Join us on a journey
        to close the loop.
      </p>
    </header>

    <section className="idea">
      <div className="section-title">
        <span>
          <span className="section-title__text">
            We are building a transparent loop to minimize waste and
          </span>
          <span className="section-title__accent">maximize humanity</span>
        </span>
      </div>
      <div className="section-content">
        <div className="content-block">
          <div className="subsection-title">Ideally,</div>
          <p className="body-text">
            food should never be wasted. Yet, tons of edible produce end up in
            landfills while millions go hungry. The disconnect isn&#039;t a lack
            of food—it&#039;s a lack of connection.
          </p>
          <p className="body-text--secondary">
            Food Loop bridges this gap. We are the digital infrastructure
            connecting the surplus of donors to the scarcity faced by
            communities, powered by the hands of volunteers.
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">03</div>
          <div className="txt">
            <div className="stat-card__label">Entities</div>
            <div className="stat-card__value">One Loop</div>
          </div>
        </div>
      </div>
    </section>

    <section className="journy">
      <div className="journey-container">
        <div className="section-header">
          <div className="section-header__title">Our Impact Journey</div>
          <div className="vector-2" aria-hidden="true" />
        </div>
      </div>

      <div className="journey-row">
        <div className="impact-card">
          <div className="impact-card__title">Environmental Impact</div>
          <p className="impact-card__description">
            We divert organic waste from landfills, directly combating methane
            emissions and conserving the water used in food production.
          </p>
          <div className="metrics-list">
            <div className="metric-row">
              <div className="metric-icon">
                <img
                  className="unavailable-cloud"
                  src="/public/Unavailable Cloud.svg"
                  alt="Methane reduction icon"
                />
              </div>
              <div className="metric-label">Methane Reduction</div>
            </div>
            <div className="metric-row">
              <div className="metric-icon">
                <img className="blur" src="/public/Blur.svg" alt="Water icon" />
              </div>
              <div className="metric-label">Water Conservation</div>
            </div>
          </div>
        </div>
        <div className="icon-circle">
          <img className="leaf" src="/public/Leaf.svg" alt="Leaf illustration" />
        </div>
        <img className="feature-image" src="/public/Frame 54.svg" alt="Impact graphic" />
      </div>

      <div className="journey-row">
        <img className="feature-image" src="/public/economic.svg" alt="Economic value" />
        <div className="icon-circle">
          <img
            className="positive-dynamic"
            src="/public/Positive Dynamic.svg"
            alt="Positive dynamic"
          />
        </div>
        <div className="impact-card">
          <div className="impact-card__title">Economic Value</div>
          <p className="impact-card__description">
            We create efficiency by turning potential losses into community
            gains, reducing disposal fees and optimizing supply logistics.
          </p>
          <div className="metrics-list">
            <div className="metric-row">
              <div className="metric-icon">
                <img
                  className="us-dollar-circled"
                  src="/public/Us Dollar Circled.svg"
                  alt="Disposal savings icon"
                />
              </div>
              <div className="metric-label">Disposal Savings</div>
            </div>
            <div className="metric-row">
              <div className="metric-icon">
                <img className="repeat" src="/public/Repeat.svg" alt="Efficiency" />
              </div>
              <div className="metric-label">
                Supply Chain Efficiency
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="journey-row">
        <div className="impact-card">
          <div className="impact-card__title">Social Responsibility</div>
          <p className="impact-card__description">
            The heart of our mission. Ensuring nutritious food reaches
            vulnerable populations, fostering dignity, health, and community
            strength.
          </p>
          <div className="metrics-list">
            <div className="metric-row">
              <div className="metric-icon">
                <img className="trust" src="/public/Trust.svg" alt="Trust icon" />
              </div>
              <div className="metric-label">Vulnerable Communities</div>
            </div>
            <div className="metric-row">
              <div className="metric-icon">
                <img
                  className="heart-with-pulse"
                  src="/public/Heart with Pulse.svg"
                  alt="Heart with pulse"
                />
              </div>
              <div className="metric-label">Public Health</div>
            </div>
          </div>
        </div>
        <div className="icon-circle">
          <img
            className="meeting-room"
            src="/public/Meeting Room.svg"
            alt="Meeting room"
          />
        </div>
        <img className="feature-image" src="/public/commitee.svg" alt="Social impact" />
      </div>
    </section>
  </section>
);

export default About;