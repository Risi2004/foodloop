import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReceiverProfile.css';
import ReceiverNavbar from '../../../../components/afterLogin/dashboard/ReceiverSection/navbar/ReceiverNavbar';
import ReceiverFooter from '../../../../components/afterLogin/dashboard/ReceiverSection/footer/ReceiverFooter';
import profile from "../../../../assets/icons/afterLogin/receiver/profile/profile.svg";
import verification from "../../../../assets/icons/afterLogin/receiver/profile/verification.svg";
import infoIcon from "../../../../assets/icons/afterLogin/receiver/profile/Business-Group.svg";
import memberProfile from "../../../../assets/icons/afterLogin/receiver/profile/member.svg";
import { getCurrentUser } from '../../../../services/api';
import { getMyClaims } from '../../../../services/donationApi';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ReceiverProfile() {
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [userRes, claimsRes] = await Promise.all([
          getCurrentUser(),
          getMyClaims(),
        ]);
        if (cancelled) return;
        if (userRes?.user) setUser(userRes.user);
        if (claimsRes?.donations) setClaims(claimsRes.donations);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <>
        <ReceiverNavbar />
        <div className="receiverProfile">
          <div className="receiverProfile__container receiverProfile__loading">
            <p>Loading profile...</p>
          </div>
        </div>
        <ReceiverFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <ReceiverNavbar />
        <div className="receiverProfile">
          <div className="receiverProfile__container receiverProfile__error">
            <p>{error}</p>
          </div>
        </div>
        <ReceiverFooter />
      </>
    );
  }

  const displayName = user?.receiverName || user?.email || 'Receiver';
  const memberSince = user?.createdAt
    ? formatDate(user.createdAt)
    : '';
  const deliveredCount = claims.filter((c) => c.status === 'delivered').length;
  const recentClaims = claims.slice(0, 10);

  return (
    <>
      <ReceiverNavbar />
      <div className="receiverProfile">
        <div className="receiverProfile__container">

          {/* Top Section: Profile & Verification */}
          <section className="receiverProfile__topSection">
            <div className="receiverProfile__idCard glass-card">
              <div className="receiverProfile__avatar">
                <img src={user?.profileImageUrl || profile} alt="Profile" />
              </div>
              <div className="receiverProfile__idDetails">
                <h2 className="receiverProfile__name">{displayName}</h2>
                <span className="receiverProfile__type">{user?.receiverType || '—'}</span>
                {memberSince && (
                  <p className="receiverProfile__tagline">
                    Member since {memberSince}.
                  </p>
                )}
                <Link to="/receiver/edit-profile" className="receiverProfile__editBtn">Edit</Link>
              </div>
            </div>

            <div className="receiverProfile__verification glass-card">
              <div className="receiverProfile__verificationHeader">
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
              <div className="receiverProfile__infoBox glass-card">
                <div className="receiverProfile__sectionHeader">
                  <img src={infoIcon} alt="Info" />
                  <h4>Community Information</h4>
                </div>
                <div className="receiverProfile__infoList">
                  <div className="receiverProfile__infoItem">
                    <label>Registration No.</label>
                    <span>—</span>
                  </div>
                  <div className="receiverProfile__infoItem">
                    <label>Contact</label>
                    <div className="receiverProfile__contactDetails">
                      <span>{displayName}</span>
                      {user?.email && (
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      )}
                    </div>
                  </div>
                  {user?.contactNo && (
                    <div className="receiverProfile__infoItem">
                      <label>Phone</label>
                      <span>{user.contactNo}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="receiverProfile__infoItem">
                      <label>Address</label>
                      <span>{user.address}</span>
                    </div>
                  )}
                  <div className="receiverProfile__map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.080538964724!2d79.84501255541992!3d6.927079361628177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259230f7d4555%3A0x6b77203cb5d83!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                      title="Location Map"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="receiverProfile__membersBox glass-card">
                <div className="receiverProfile__sectionHeader">
                  <img src={infoIcon} alt="Members" />
                  <h4>Community Member</h4>
                </div>
                <div className="receiverProfile__memberList">
                  <div className="receiverProfile__member">
                    <img src={memberProfile} alt="Member" className="member-avatar" />
                    <div className="receiverProfile__memberInfo">
                      <span className="member-name">{displayName}</span>
                      <span className="member-role">{user?.receiverType || 'Receiver'}</span>
                      <span className="member-subrole">{user?.email || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content: Stats, About, Donations */}
            <main className="receiverProfile__contentArea glass-card">

              <div className="receiverProfile__statsGrid">
                <div className="stats-card">
                  <h5>Total Claims</h5>
                  <div className="stats-value">
                    <span>{claims.length}</span>
                  </div>
                  <small>Donations received</small>
                </div>
                <div className="stats-card">
                  <h5>Delivered</h5>
                  <div className="stats-value">
                    <span>{deliveredCount}</span>
                  </div>
                  <small>Completed deliveries</small>
                </div>
                <div className="stats-card">
                  <h5>Total Quantity</h5>
                  <div className="stats-value">
                    <span>{claims.reduce((sum, c) => sum + (Number(c.quantity) || 0), 0)}</span>
                  </div>
                  <small>Units received</small>
                </div>
                <div className="stats-card">
                  <h5>Status</h5>
                  <div className="stats-value">
                    <span>{user?.status === 'completed' ? 'Verified' : user?.status || '—'}</span>
                  </div>
                  <small>Account status</small>
                </div>
              </div>

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

              <div className="receiverProfile__donationsSection">
                <div className="donations-header">
                  <h4>Recent Received Donations</h4>
                  <Link to="/receiver/my-claims">View All</Link>
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
                      {recentClaims.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="receiverProfile__noClaims">No received donations yet.</td>
                        </tr>
                      ) : (
                        recentClaims.map((c) => (
                          <tr key={c.id}>
                            <td>{c.donorName || '—'}</td>
                            <td className="text-date">{formatDate(c.createdAt)}</td>
                            <td>{c.quantity ?? '—'}</td>
                            <td><span className="tag tag-purple">{c.itemName || c.foodCategory || '—'}</span></td>
                          </tr>
                        ))
                      )}
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
