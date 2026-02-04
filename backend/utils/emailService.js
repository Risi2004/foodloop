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

module.exports = {
  sendWelcomeEmail,
  sendPendingApprovalEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendDeactivationEmail,
  sendActivationEmail,
  sendDonationLiveEmail,
};
