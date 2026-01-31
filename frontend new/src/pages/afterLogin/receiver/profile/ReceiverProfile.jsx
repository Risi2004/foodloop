import './ReceiverProfile.css';
import ReceiverNavbar from '../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar';
import ReceiverFooter from '../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter';
import profile from "../../../../assets/icons/afterLogin/receiver/profile/profile.svg";
import verification from "../../../../assets/icons/afterLogin/receiver/profile/verification.svg";
import infoIcon from "../../../../assets/icons/afterLogin/receiver/profile/Business-Group.svg";
import memberProfile from "../../../../assets/icons/afterLogin/receiver/profile/member.svg"


function ReceiverProfile() {
  return (
    <>
      <ReceiverNavbar />
      <div className="receiverProfile">
        <div className="receiverProfile__container">

          {/* Top Section: Profile & Verification */}
          <section className="receiverProfile__topSection">
            <div className="receiverProfile__idCard glass-card">
              <div className="receiverProfile__avatar">
                <img src={profile} alt="Profile" />
              </div>
              <div className="receiverProfile__idDetails">
                <h2 className="receiverProfile__name">Nourish Community</h2>
                <span className="receiverProfile__type">NGO</span>
                <p className="receiverProfile__tagline">
                  Connecting surplus food to families in need since 2012.
                </p>
                <a href="/receiver-profile-edit" className="receiverProfile__editBtn">Edit</a>
              </div>
            </div>

            <div className="receiverProfile__verification glass-card">
              <div className="receiverProfile__verificationHeader">
                {/* SVG path might need adjustment or import, keeping string for now */}
                <img src={verification} alt="Verified" />
                <h3>Verification</h3>
              </div>
              <div className="receiverProfile__badgeGrid">
                <div className="receiverProfile__badge">
                  <span className="receiverProfile__badgeTitle text-green">NGO Registration</span>
                  <span className="receiverProfile__badgeStatus">Valid until Oct 2028</span>
                </div>
                <div className="receiverProfile__badge">
                  <span className="receiverProfile__badgeTitle text-green">Food Safety Permit</span>
                  <span className="receiverProfile__badgeStatus">Health Dept Approved</span>
                </div>
                <div className="receiverProfile__badge">
                  <span className="receiverProfile__badgeTitle text-green">Tax-Exempt Status</span>
                  <span className="receiverProfile__badgeStatus">Verified 501(c)(3)</span>
                </div>
                <div className="receiverProfile__badge">
                  <span className="receiverProfile__badgeTitle text-green">2023 Annual Audit</span>
                  <span className="receiverProfile__badgeStatus">Under Review</span>
                </div>
              </div>
            </div>
          </section>

          <div className="receiverProfile__mainGrid">

            {/* Sidebar: Community Info & Members */}
            <aside className="receiverProfile__sidebar">
              {/* Community Info */}
              <div className="receiverProfile__infoBox glass-card">
                <div className="receiverProfile__sectionHeader">
                  <img src={infoIcon} alt="Info" />
                  <h4>Community Information</h4>
                </div>
                <div className="receiverProfile__infoList">
                  <div className="receiverProfile__infoItem">
                    <label>Registration No.</label>
                    <span>REG-882910-NYC</span>
                  </div>
                  <div className="receiverProfile__infoItem">
                    <label>Sustainability Contact</label>
                    <div className="receiverProfile__contactDetails">
                      <span>Sarah Jenkins</span>
                      <a href="mailto:s.jenkins@gmail.com">s.jenkins@gmail.com</a>
                    </div>
                  </div>
                  <div className="receiverProfile__infoItem">
                    <label>Address</label>
                    <span>123 Sustainability Way<br />Downtown Financial District, NY 10004</span>
                  </div>
                  <div className="receiverProfile__map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.080538964724!2d79.84501255541992!3d6.927079361628177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259230f7d4555%3A0x6b77203cb5d83!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                      title="Location Map"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Community Member */}
              <div className="receiverProfile__membersBox glass-card">
                <div className="receiverProfile__sectionHeader">
                  <img src={infoIcon} alt="Members" />
                  <h4>Community Member</h4>
                </div>
                <div className="receiverProfile__memberList">
                  <div className="receiverProfile__member">
                    <img src={memberProfile} alt="Member" className="member-avatar" />
                    <div className="receiverProfile__memberInfo">
                      <span className="member-name">Dr. Sarah Jenkins</span>
                      <span className="member-role">Executive Director</span>
                      <span className="member-subrole">Nutrition Specialist</span>
                    </div>
                  </div>
                  <div className="receiverProfile__member">
                    <img src={memberProfile} alt="Member" className="member-avatar" />
                    <div className="receiverProfile__memberInfo">
                      <span className="member-name">Marcus Thompson</span>
                      <span className="member-role">Head of Logistics</span>
                      <span className="member-subrole">Supply Chain Expert</span>
                    </div>
                  </div>
                  <div className="receiverProfile__member">
                    <img src={memberProfile} alt="Member" className="member-avatar" />
                    <div className="receiverProfile__memberInfo">
                      <span className="member-name">David Chen</span>
                      <span className="member-role">Treasurer</span>
                      <span className="member-subrole">Financial Audit</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content: Stats, About, Donations */}
            <main className="receiverProfile__contentArea glass-card">

              {/* Stats */}
              <div className="receiverProfile__statsGrid">
                <div className="stats-card">
                  <h5>Total Meals Distributed</h5>
                  <div className="stats-value">
                    <span>125,400</span>
                    <span className="stats-trend positive">+12%</span>
                  </div>
                  <small>Lifetime impact</small>
                </div>
                <div className="stats-card">
                  <h5>Families Supported</h5>
                  <div className="stats-value">
                    <span>8,200</span>
                    <span className="stats-trend positive">+5%</span>
                  </div>
                  <small>Active households</small>
                </div>
                <div className="stats-card">
                  <h5>Food Waste Diverted</h5>
                  <div className="stats-value">
                    <span>42.5T</span>
                    <span className="stats-trend positive">+12%</span>
                  </div>
                  <small>Lifetime impact</small>
                </div>
                <div className="stats-card">
                  <h5>Transparency Score</h5>
                  <div className="stats-value">
                    <span>98%</span>
                  </div>
                  <small>Audit rating</small>
                </div>
              </div>

              {/* About */}
              <div className="receiverProfile__aboutSection">
                <h4 className="section-title text-green">About the Organization</h4>
                <p>
                  Global Food Relief NGO has been operating for over 10 years, focusing on redistributing surplus fresh produce to underserved urban neighborhoods. Our cold-chain logistics ensure that every donation reaches families in peak condition.
                </p>
                <p>
                  We partner with local grocery chains and regional farmers to minimize food waste while maximizing nutritional impact. Our team of 200+ volunteers operates across three counties daily.
                </p>
                <div className="receiverProfile__capabilities">
                  <div className="capability-box">
                    <span className="cap-label">Primary Focus</span>
                    <span className="cap-value">Fresh Produce & Perishables</span>
                  </div>
                  <div className="capability-box">
                    <span className="cap-label">Storage Capacity</span>
                    <span className="cap-value">5,000 sq ft Cold Storage</span>
                  </div>
                </div>
              </div>

              {/* Donations */}
              <div className="receiverProfile__donationsSection">
                <div className="donations-header">
                  <h4>Recent Received Donations</h4>
                  <a href="#">View All</a>
                </div>
                <div className="donations-table-wrapper">
                  <table className="donations-table">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Item Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Durairaj "JD"</td>
                        <td className="text-date">Jan 14, 2026</td>
                        <td>5KG</td>
                        <td><span className="tag tag-purple">Mixed Leaf Salad</span></td>
                      </tr>
                      <tr>
                        <td>Kathiresan</td>
                        <td className="text-date">Jan 24, 2026</td>
                        <td>3KG</td>
                        <td><span className="tag tag-orange">Fresh Carrots</span></td>
                      </tr>
                      <tr>
                        <td>Thalapathy Vetri Kondan</td>
                        <td className="text-date">Dec 24, 2025</td>
                        <td>6KG</td>
                        <td><span className="tag tag-green">Organic Apples</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>
      <ReceiverFooter />
    </>
  );
}

export default ReceiverProfile;
