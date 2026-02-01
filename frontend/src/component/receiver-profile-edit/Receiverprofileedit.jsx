import { useState, useRef } from 'react';
import './Receiverprofileedit.css';

const Receiverprofileedit = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [profileImage, setProfileImage] = useState('/src/assets/Account Male.svg');
  const fileInputRef = useRef(null);

  const handleChangePasswordClick = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== retypePassword) {
      alert('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // Handle password change logic here
    console.log('Password changed:', password);
    alert('Password changed successfully!');
    setPassword('');
    setRetypePassword('');
    setShowPasswordForm(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file!');
        return;
      }
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='profile-edit-container'>
      <div className='edit__profile'>
          <div className="headedit">
              <h2>Edit Profile</h2>
          <p>Manage your business identity, branch locations, and security settings.</p>
          </div>
          
          <div className="prof">
              <div className="profimg">
                  <img src={profileImage} alt="profile" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="cam" onClick={handleImageClick}>
                  <img src="/src/assets/Camera.svg" alt="cam" />
              </div>
          </div>
          <div className="active-donor">Active Donor</div>
      
          <div className="name">
              <h5>GreenGrocer Co.</h5>
              <p>Member Since Oct 2023</p>
          </div>

          <div className="change-password" onClick={handleChangePasswordClick} style={{ cursor: 'pointer' }}>
              <img src="/src/assets/Lock.svg" alt="lock" />
              <h4>Change Password</h4>
          </div>

          {showPasswordForm && (
            <form className="frame-73" onSubmit={handleSubmit}>
              <div className="email">
                <div className="password">Password</div>
                <div className="frame-31">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="email">
                <div className="retype-password">Retype Password</div>
                <div className="frame-31">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Retype password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="email">
                <button type="submit" className="frame-312">
                  <div className="john-doe2">SAVE</div>
                </button>
              </div>
            </form>
          )}
      </div>

      <div className="frame-145">
        <div className="frame-99">
          <div className="frame-100">
            <img className="customer" src="/src/assets/Business Group.svg" alt="customer" />
          </div>
          <div className="personal-information">Community Information</div>
        </div>
        <div className="un-email">
          <div className="username">
            <div className="business-name">Business name</div>
            <div className="frame-31">
              <input
                type="text"
                className="input-field"
                placeholder="Eg:-jjhon."
              />
            </div>
          </div>
          <div className="username">
            <div className="sustainability-contact-email">
              Sustainability Contact Email
            </div>
            <div className="frame-312-email">
              <input
                type="email"
                className="input-field"
                placeholder="Eg:-jjhon@gmail.com."
              />
            </div>
          </div>
        </div>
        <div className="un-email">
          <div className="username">
            <div className="sustainability-name">Sustainability name</div>
            <div className="frame-31">
              <input
                type="text"
                className="input-field"
                placeholder="Eg:-jjhon."
              />
            </div>
          </div>
          <div className="username">
            <div className="registration-no">Registration No.</div>
            <div className="frame-313">
              <input
                type="text"
                className="input-field"
                placeholder="REG-882910-NYC"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="contact-number">
          <div className="pickup-address">Pickup Address</div>
          <div className="frame-314">
            <textarea
              className="input-field textarea-field"
              placeholder="Eg:-Downtown Financial District, NY 10004."
              rows="4"
            />
          </div>
        </div>
        <div className="email">
          <div className="address-proof">Address Proof</div>
          <div className="frame-77">
            <div className="frame-78">
              <div className="import-or-darg-file">Import or Drag File</div>
              <div className="add-file-text">Add file</div>
            </div>
          </div>
        </div>
        <div className="frame-149">
          <div className="frame-150">
            <div className="cancel">Cancel</div>
          </div>
          <div className="frame-151">
            <div className="save">Save</div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Receiverprofileedit;
