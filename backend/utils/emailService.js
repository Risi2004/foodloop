const { transporter, isEmailConfigured, EMAIL_FROM } = require('../config/email');

/**
 * Get user display name based on role
 */
const getUserDisplayName = (user) => {
  if (user.role === 'Donor') {
    if (user.donorType === 'Business') {
      return user.businessName || user.email;
    } else {
      return user.username || user.email;
    }
  } else if (user.role === 'Receiver') {
    return user.receiverName || user.email;
  } else if (user.role === 'Driver') {
    return user.driverName || user.email;
  }
  return user.email;
};

/**
 * Send welcome email to Individual Donors
 * (Account is immediately active)
 */
const sendWelcomeEmail = async (user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping welcome email.');
    return;
  }

  try {
    const userName = getUserDisplayName(user);
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to FoodLoop! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to FoodLoop!</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Thank you for joining FoodLoop! We're excited to have you as part of our community.</p>
            <p>Your account has been successfully created and is <strong>ready to use</strong>. You can now:</p>
            <ul>
              <li>Start donating food to help reduce waste</li>
              <li>Connect with receivers in your area</li>
              <li>Make a positive impact in your community</li>
            </ul>
            <p>You can log in to your account and start using FoodLoop right away!</p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>The FoodLoop Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} FoodLoop. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${user.email}:`, error.message);
    // Don't throw error - email failure shouldn't break signup
  }
};

/**
 * Send pending approval email to Business Donors, Receivers, and Drivers
 * (Account needs admin approval)
 */
const sendPendingApprovalEmail = async (user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping pending approval email.');
    return;
  }

  try {
    const userName = getUserDisplayName(user);
    const roleDisplay = user.role === 'Donor' && user.donorType === 'Business' 
      ? 'Business Donor' 
      : user.role;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Your FoodLoop Registration is Under Review',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Registration Received</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Thank you for registering with FoodLoop as a <strong>${roleDisplay}</strong>!</p>
            <div class="info-box">
              <p><strong>Your registration is currently under review.</strong></p>
              <p>Our admin team will carefully review all the information and documents you've submitted. This process typically takes 1-2 business days.</p>
            </div>
            <p>Once your account is approved, you will receive an email notification and will be able to log in and start using FoodLoop.</p>
            <p>We appreciate your patience during this review process.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The FoodLoop Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} FoodLoop. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Pending approval email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending pending approval email to ${user.email}:`, error.message);
    // Don't throw error - email failure shouldn't break signup
  }
};

/**
 * Send approval confirmation email
 * (Account has been approved by admin)
 */
const sendApprovalEmail = async (user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping approval email.');
    return;
  }

  try {
    const userName = getUserDisplayName(user);
    const roleDisplay = user.role === 'Donor' && user.donorType === 'Business' 
      ? 'Business Donor' 
      : user.role;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Your FoodLoop Account Has Been Approved! ✅',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .success-box {
              background: #d4edda;
              border-left: 4px solid #28a745;
              padding: 15px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Account Approved! 🎉</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <div class="success-box">
              <p><strong>Great news! Your FoodLoop account has been approved.</strong></p>
              <p>You can now log in and start using FoodLoop as a ${roleDisplay}.</p>
            </div>
            <p>Your account is now active and ready to use. You can:</p>
            <ul>
              ${user.role === 'Donor' ? '<li>Start donating food items</li>' : ''}
              ${user.role === 'Receiver' ? '<li>Browse available food donations</li><li>Claim food items</li>' : ''}
              ${user.role === 'Driver' ? '<li>View available pickup requests</li><li>Start delivering food</li>' : ''}
              <li>Access all features of your account</li>
            </ul>
            <p>We're excited to have you as part of the FoodLoop community!</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The FoodLoop Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} FoodLoop. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending approval email to ${user.email}:`, error.message);
    // Don't throw error - email failure shouldn't break approval
  }
};

/**
 * Send rejection email (optional)
 */
const sendRejectionEmail = async (user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping rejection email.');
    return;
  }

  try {
    const userName = getUserDisplayName(user);
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'FoodLoop Registration Update',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: #f8d7da;
              border-left: 4px solid #dc3545;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Registration Update</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Thank you for your interest in joining FoodLoop.</p>
            <div class="info-box">
              <p><strong>We regret to inform you that your FoodLoop registration could not be approved at this time.</strong></p>
              <p>After careful review of your submitted information and documents, we were unable to approve your account registration.</p>
            </div>
            <p>This decision may be due to:</p>
            <ul>
              <li>Incomplete or missing documentation</li>
              <li>Information that doesn't meet our verification requirements</li>
              <li>Other compliance-related factors</li>
            </ul>
            <p>If you believe this is an error or would like to discuss your registration further, please contact our support team at <strong>foodloop.official27@gmail.com</strong>.</p>
            <p>We appreciate your understanding and thank you for your interest in FoodLoop.</p>
            <p>Best regards,<br>The FoodLoop Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} FoodLoop. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending rejection email to ${user.email}:`, error.message);
  }
};

/**
 * Send account deactivation email
 */
const sendDeactivationEmail = async (user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping deactivation email.');
    return;
  }

  try {
    const userName = getUserDisplayName(user);
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Your FoodLoop Account Has Been Deactivated',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: #f8d7da;
              border-left: 4px solid #dc3545;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Account Deactivated</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <div class="info-box">
              <p><strong>Your FoodLoop account has been deactivated.</strong></p>
              <p>You will no longer be able to access your account or use FoodLoop services until your account is reactivated by an administrator.</p>
            </div>
            <p>If you believe this is an error or have any questions, please contact our support team at <strong>foodloop.official27@gmail.com</strong>.</p>
            <p>We apologize for any inconvenience this may cause.</p>
            <p>Best regards,<br>The FoodLoop Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} FoodLoop. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Deactivation email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending deactivation email to ${user.email}:`, error.message);
  }
};

/**
 * Send account activation/reactivation email
 */
const sendActivationEmail = async (user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping activation email.');
    return;
  }

  try {
    const userName = getUserDisplayName(user);
    const roleDisplay = user.role === 'Donor' && user.donorType === 'Business' 
      ? 'Business Donor' 
      : user.role;
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Your FoodLoop Account Has Been Activated! ✅',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .success-box {
              background: #d4edda;
              border-left: 4px solid #28a745;
              padding: 15px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(180deg, #1F4E36 0%, #48B47D 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Account Activated! 🎉</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <div class="success-box">
              <p><strong>Great news! Your FoodLoop account has been activated.</strong></p>
              <p>You can now log in and start using FoodLoop as a ${roleDisplay}.</p>
            </div>
            <p>Your account is now active and ready to use. You can:</p>
            <ul>
              ${user.role === 'Donor' ? '<li>Start donating food items</li>' : ''}
              ${user.role === 'Receiver' ? '<li>Browse available food donations</li><li>Claim food items</li>' : ''}
              ${user.role === 'Driver' ? '<li>View available pickup requests</li><li>Start delivering food</li>' : ''}
              <li>Access all features of your account</li>
            </ul>
            <p>We're excited to have you back in the FoodLoop community!</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The FoodLoop Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} FoodLoop. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Activation email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending activation email to ${user.email}:`, error.message);
  }
};

/**
 * Send donation live confirmation email
 * Sent when a donation is successfully posted
 */
const sendDonationLiveEmail = async (donation, user) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping donation live email.');
    return;
  }

  try {
    const displayName = getUserDisplayName(user);
    const expiryDate = new Date(donation.expiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const pickupDate = new Date(donation.preferredPickupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: '🎉 Your Donation is Now Live!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Live</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Donation is Live!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${displayName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! Your donation has been successfully posted and is now live on FoodLoop.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">Donation Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Tracking ID:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.trackingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Item Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.itemName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Category:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.foodCategory}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Quantity:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Expiry Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${expiryDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${pickupDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Window:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.preferredPickupTimeFrom} - ${donation.preferredPickupTimeTo}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Status:</td>
                  <td style="padding: 8px 0; color: #10b981; font-weight: bold;">${donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>📋 What's Next?</strong><br>
                Your donation is now visible to receivers. Once a receiver accepts your donation, a driver will be assigned for pickup.
                You can track the status of your donation using the tracking ID above.
              </p>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Thank you for your generous contribution to reducing food waste and helping those in need!
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              <strong>The FoodLoop Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Donation live email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending donation live email to ${user.email}:`, error.message);
    // Don't throw error - email failure shouldn't break donation creation
  }
};

/**
 * Send new donation notification email to a single receiver
 * @param {Object} donation - Donation object
 * @param {Object} donor - Donor user object
 * @param {Object} receiver - Receiver user object
 */
const sendNewDonationNotificationToReceiver = async (donation, donor, receiver) => {
  if (!isEmailConfigured() || !transporter) {
    return;
  }

  try {
    const donorName = getUserDisplayName(donor);
    const receiverName = getUserDisplayName(receiver);
    const expiryDate = new Date(donation.expiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const pickupDate = new Date(donation.preferredPickupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: receiver.email,
      subject: '🍽️ New Food Donation Available!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Donation Available</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🍽️ New Donation Available!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${receiverName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! A new food donation has been posted on FoodLoop and is now available for claiming.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">Donation Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Item Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.itemName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Category:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.foodCategory}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Quantity:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Donor:</td>
                  <td style="padding: 8px 0; color: #111827;">${donorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Location:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.donorAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Expiry Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${expiryDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${pickupDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Window:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.preferredPickupTimeFrom} - ${donation.preferredPickupTimeTo}</td>
                </tr>
                ${donation.aiQualityScore ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Quality Score:</td>
                  <td style="padding: 8px 0; color: #111827;">${(donation.aiQualityScore * 100).toFixed(0)}%</td>
                </tr>
                ` : ''}
                ${donation.aiFreshness ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Freshness:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.aiFreshness}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>⚡ Act Fast!</strong><br>
                This donation is available on a first-come, first-served basis. Log in to your FoodLoop account to claim it now!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/receiver/find-food" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View & Claim Donation
              </a>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Thank you for being part of the FoodLoop community and helping reduce food waste!
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              <strong>The FoodLoop Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ New donation notification email sent to receiver: ${receiver.email}`);
  } catch (error) {
    console.error(`❌ Error sending new donation notification email to ${receiver.email}:`, error.message);
    // Don't throw error - email failure shouldn't break the process
  }
};

/**
 * Send new donation notification emails to all registered receivers
 * @param {Object} donation - Donation object
 * @param {Object} donor - Donor user object
 */
const sendNewDonationNotificationToReceivers = async (donation, donor) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping new donation notification emails to receivers.');
    return;
  }

  try {
    // Import User model here to avoid circular dependencies
    const User = require('../models/User');
    
    // Fetch all receivers with status 'completed' (approved receivers)
    const receivers = await User.find({
      role: 'Receiver',
      status: 'completed',
    }).select('email receiverName');

    if (!receivers || receivers.length === 0) {
      console.log('[Donations] No approved receivers found. Skipping email notifications.');
      return;
    }

    console.log(`[Donations] Sending new donation notification to ${receivers.length} receiver(s)...`);

    // Send emails to all receivers asynchronously (don't wait for all to complete)
    // Use Promise.allSettled to handle individual failures gracefully
    const emailPromises = receivers.map(receiver => 
      sendNewDonationNotificationToReceiver(donation, donor, receiver)
    );

    const results = await Promise.allSettled(emailPromises);
    
    // Count successful and failed emails
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`[Donations] Email notifications sent: ${successful} successful, ${failed} failed`);
    
    if (failed > 0) {
      console.warn(`[Donations] ${failed} email notification(s) failed, but donation was still created successfully.`);
    }
  } catch (error) {
    console.error('[Donations] Error sending new donation notifications to receivers:', error.message);
    // Don't throw error - email failure shouldn't break donation creation
  }
};

/**
 * Send donation claimed notification email to donor
 * Sent when a receiver claims their donation
 */
const sendDonationClaimedEmail = async (donation, donor, receiver) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping donation claimed email.');
    return;
  }

  try {
    const donorName = getUserDisplayName(donor);
    const receiverName = getUserDisplayName(receiver);
    const expiryDate = new Date(donation.expiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const pickupDate = new Date(donation.preferredPickupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: donor.email,
      subject: '🎉 Your Donation Has Been Claimed!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Claimed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Donation Has Been Claimed!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${donorName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! Your food donation has been claimed by a receiver. A driver will be allocated soon to pick up the donation.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">Donation Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Tracking ID:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.trackingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Item Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.itemName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Category:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.foodCategory}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Quantity:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Expiry Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${expiryDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${pickupDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Window:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.preferredPickupTimeFrom} - ${donation.preferredPickupTimeTo}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>📋 What's Next?</strong><br>
                Your donation has been claimed by <strong>${receiverName}</strong>. A driver will be allocated soon to pick up the donation from your location. You'll receive another notification once the driver is assigned.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/donor/my-donation" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View My Donations
              </a>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Thank you for your generous contribution to reducing food waste and helping those in need!
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              <strong>The FoodLoop Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Donation claimed email sent to donor: ${donor.email}`);
  } catch (error) {
    console.error(`❌ Error sending donation claimed email to ${donor.email}:`, error.message);
    // Don't throw error - email failure shouldn't break the claim process
  }
};

/**
 * Send pickup confirmed email to donor
 * Sent when a driver confirms pickup of the donation
 */
const sendPickupConfirmedEmailToDonor = async (donation, donor, driver) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping pickup confirmed email to donor.');
    return;
  }

  try {
    const donorName = getUserDisplayName(donor);
    const driverName = getUserDisplayName(driver);
    const pickupDate = new Date(donation.preferredPickupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: donor.email,
      subject: '🚚 Driver Has Confirmed Pickup of Your Donation!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pickup Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚚 Pickup Confirmed!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${donorName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! A driver has confirmed pickup of your donation. The driver will be arriving at your location soon to collect the food.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h2 style="color: #3b82f6; margin-top: 0; font-size: 20px;">Donation Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Tracking ID:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.trackingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Item Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.itemName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Quantity:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${pickupDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Window:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.preferredPickupTimeFrom} - ${donation.preferredPickupTimeTo}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 18px;">Driver Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Driver Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${driverName}</td>
                </tr>
                ${driver.vehicleNumber ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Vehicle Number:</td>
                  <td style="padding: 8px 0; color: #111827;">${driver.vehicleNumber}</td>
                </tr>
                ` : ''}
                ${driver.vehicleType ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Vehicle Type:</td>
                  <td style="padding: 8px 0; color: #111827;">${driver.vehicleType}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>📋 What's Next?</strong><br>
                Please have your donation ready for pickup. The driver will arrive at your location during the specified pickup window. 
                You can track the delivery status from your dashboard.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/donor/my-donation" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View My Donations
              </a>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Thank you for your generous contribution!
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              <strong>The FoodLoop Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Pickup confirmed email sent to donor: ${donor.email}`);
  } catch (error) {
    console.error(`❌ Error sending pickup confirmed email to donor ${donor.email}:`, error.message);
  }
};

/**
 * Send pickup confirmed email to receiver
 * Sent when a driver confirms pickup of the donation
 */
const sendPickupConfirmedEmailToReceiver = async (donation, receiver, driver) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping pickup confirmed email to receiver.');
    return;
  }

  try {
    const receiverName = getUserDisplayName(receiver);
    const driverName = getUserDisplayName(driver);
    const donorName = donation.donorName || 'Donor';
    const pickupDate = new Date(donation.preferredPickupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: receiver.email,
      subject: '🚚 Driver Has Confirmed Pickup - Your Food is on the Way!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pickup Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚚 Pickup Confirmed!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${receiverName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! A driver has confirmed pickup of your claimed donation. Your food is now on the way to you!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">Donation Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Tracking ID:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.trackingId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Item Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.itemName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Quantity:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">From Donor:</td>
                  <td style="padding: 8px 0; color: #111827;">${donorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Date:</td>
                  <td style="padding: 8px 0; color: #111827;">${pickupDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Pickup Window:</td>
                  <td style="padding: 8px 0; color: #111827;">${donation.preferredPickupTimeFrom} - ${donation.preferredPickupTimeTo}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 18px;">Driver Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Driver Name:</td>
                  <td style="padding: 8px 0; color: #111827;">${driverName}</td>
                </tr>
                ${driver.vehicleNumber ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Vehicle Number:</td>
                  <td style="padding: 8px 0; color: #111827;">${driver.vehicleNumber}</td>
                </tr>
                ` : ''}
                ${driver.vehicleType ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Vehicle Type:</td>
                  <td style="padding: 8px 0; color: #111827;">${driver.vehicleType}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>📋 What's Next?</strong><br>
                The driver is now on the way to pick up your donation from the donor. You can track the delivery status in real-time from your dashboard. 
                The driver will deliver the food to your location soon.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/receiver/my-claims" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Track My Claims
              </a>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Thank you for being part of the FoodLoop community!
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Best regards,<br>
              <strong>The FoodLoop Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Pickup confirmed email sent to receiver: ${receiver.email}`);
  } catch (error) {
    console.error(`❌ Error sending pickup confirmed email to receiver ${receiver.email}:`, error.message);
  }
};

/**
 * Send delivery confirmed email to donor
 */
const sendDeliveryConfirmedEmailToDonor = async (donation, donor, receiver, driver) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping delivery confirmed email to donor.');
    return;
  }

  try {
    const donorName = getUserDisplayName(donor);
    const receiverName = getUserDisplayName(receiver);
    const driverName = driver?.driverName || 'Driver';
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: donor.email,
      subject: '✅ Your Donation Has Been Delivered Successfully!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .info-box {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #1b4332;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="success-icon">✅</div>
            <h1 style="margin: 0;">Delivery Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${donorName},</p>
            
            <p>Great news! Your donation has been successfully delivered to the receiver.</p>
            
            <div class="info-box">
              <strong>Donation Details:</strong><br>
              <strong>Item:</strong> ${donation.itemName}<br>
              <strong>Quantity:</strong> ${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}<br>
              <strong>Tracking ID:</strong> ${donation.trackingId}<br>
              <strong>Delivered to:</strong> ${receiverName}<br>
              <strong>Delivered by:</strong> ${driverName}
            </div>
            
            <p>Thank you for your generous contribution to reducing food waste and helping those in need!</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Delivery confirmed email sent to donor: ${donor.email}`);
  } catch (error) {
    console.error(`❌ Error sending delivery confirmed email to donor ${donor.email}:`, error.message);
  }
};

/**
 * Send delivery confirmed email to receiver
 */
const sendDeliveryConfirmedEmailToReceiver = async (donation, receiver, driver) => {
  if (!isEmailConfigured() || !transporter) {
    console.warn('Email not configured. Skipping delivery confirmed email to receiver.');
    return;
  }

  try {
    const receiverName = getUserDisplayName(receiver);
    const driverName = driver?.driverName || 'Driver';
    const donor = await require('../models/User').findById(donation.donorId);
    const donorName = donor ? getUserDisplayName(donor) : 'Donor';
    
    const mailOptions = {
      from: EMAIL_FROM,
      to: receiver.email,
      subject: '✅ Your Food Donation Has Arrived!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .info-box {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #1b4332;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="success-icon">🎉</div>
            <h1 style="margin: 0;">Delivery Complete!</h1>
          </div>
          <div class="content">
            <p>Dear ${receiverName},</p>
            
            <p>Your food donation has been successfully delivered!</p>
            
            <div class="info-box">
              <strong>Donation Details:</strong><br>
              <strong>Item:</strong> ${donation.itemName}<br>
              <strong>Quantity:</strong> ${donation.quantity} ${donation.quantity === 1 ? 'serving' : 'servings'}<br>
              <strong>Tracking ID:</strong> ${donation.trackingId}<br>
              <strong>From:</strong> ${donorName}<br>
              <strong>Delivered by:</strong> ${driverName}
            </div>
            
            <p>Please ensure the food is stored properly according to the storage recommendations.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              If you have any questions, contact us at <strong>foodloop.official27@gmail.com</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Delivery confirmed email sent to receiver: ${receiver.email}`);
  } catch (error) {
    console.error(`❌ Error sending delivery confirmed email to receiver ${receiver.email}:`, error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPendingApprovalEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendDeactivationEmail,
  sendActivationEmail,
  sendDonationLiveEmail,
  sendNewDonationNotificationToReceivers,
  sendNewDonationNotificationToReceiver,
  sendDonationClaimedEmail,
  sendPickupConfirmedEmailToDonor,
  sendPickupConfirmedEmailToReceiver,
  sendDeliveryConfirmedEmailToDonor,
  sendDeliveryConfirmedEmailToReceiver,
};
