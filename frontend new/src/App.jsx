import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/beforeLogin/landingPage/LandingPage";
import DonorDashboard from "./pages/afterLogin/donor/dashboard/DonorDashboard"
import LoginPage from "./pages/beforeLogin/loginPage/LoginPage";
import SignupPage from "./pages/beforeLogin/signupPage/Signup";
import ReceiverDashboard from "./pages/afterLogin/receiver/dashboard/ReceiverDashboard"
import DriverDashboard from "./pages/afterLogin/driver/dashboard/DriverDashboard";
import DonorAbout from "./pages/afterLogin/donor/about/DonorAbout";
import ReceiverAbout from "./pages/afterLogin/receiver/about/ReceiverAbout";
import DriverAbout from "./pages/afterLogin/driver/about/DriverAbout";
import LandingPagePrivacyPolicy from "./pages/beforeLogin/privacyPolicy/LandingPagePrivacyPolicy";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import DonorPrivacyPolicy from "./pages/afterLogin/donor/privacyPolicy/DonorPrivacyPolicy";
import DriverPrivacyPolicy from "./pages/afterLogin/driver/privacyPolicy/DriverPrivacyPolicy";
import ReceiverPrivacyPolicy from "./pages/afterLogin/receiver/privacyPolicy/ReceiverPrivacyPolicy";
import LandingPageTermsAndConditions from "./pages/beforeLogin/termsAndConditions/LandingPageTermsAndConditions";
import DonorTermsAndConditions from "./pages/afterLogin/donor/termsAndConditions/DonorTermsAndConditions";
import ReceiverTermsAndConditions from "./pages/afterLogin/receiver/termsAndConditions/ReceiverTermsAndConditions";
import DriverTermsAndConditions from "./pages/afterLogin/driver/termsAndConditions/DriverTermsAndConditions";
import DonorNotifications from "./pages/afterLogin/donor/notifications/DonorNotifications";
import DriverNotifications from "./pages/afterLogin/driver/notifications/DriverNotifications";
import ReceiverNotifications from "./pages/afterLogin/receiver/notifications/ReceiverNotifications";
import ReceiverProfile from "./pages/afterLogin/receiver/profile/ReceiverProfile";
import Delivery from "./pages/afterLogin/driver/delivery/Delivery";
import DriverProfile from "./pages/afterLogin/driver/profile/DriverProfile";
import EditProfile from "./pages/afterLogin/driver/editProfile/EditProfile";
import MyPickups from "./pages/afterLogin/driver/myPickups/MyPickups";
import Pickup from "./pages/afterLogin/driver/Pickup/Pickup";
import AdminDashboardPage from "./pages/afterLogin/admin/dashboard/AdminDashboardPage";
import AdminNotificationPage from "./pages/afterLogin/admin/notificationPage/AdminNotificationPage";
import AdminUserManagementPage from "./pages/afterLogin/admin/userManagementPage/AdminUserManagementPage";
import AdminReviewManagementPage from "./pages/afterLogin/admin/reviewManagementPage/ReviewManagementPage";
import AdminMessagesPage from "./pages/afterLogin/admin/messagesPage/AdminMessagesPage";
import DonorProfile from "./pages/afterLogin/donor/profile/DonorProfile";
import DonorEditProfile from "./pages/afterLogin/donor/editProfile/DonorEditProfile";
import DonorMyDontaion from "./pages/afterLogin/donor/myDonation/DonorMyDonation";
import DonorTrackingPage from "./pages/afterLogin/donor/trackingPage/DonorTrackingPage";
import DigitalReceipt from "./pages/afterLogin/donor/digitalReceipt/DigitalReceipt";
import IndividualEditProfile from "./pages/afterLogin/donor/individualEditProfile/IndividualEditProfile";
import ReceiverFindFood from "./pages/afterLogin/receiver/findFood/ReceiverFindFood";
import ReceiptForm from "./pages/afterLogin/receiver/receiptForm/ReceiptForm";
import Myclaims from "./pages/afterLogin/receiver/myClaims/MyClaims";


function App() {


  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Before Signin */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/privacy-policy" element={<LandingPagePrivacyPolicy />} />
        <Route path="/terms-&-conditions" element={<LandingPageTermsAndConditions />} />

        {/* After Signin */}

        {/* Donor */}

        <Route path="/donor">
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="about" element={<DonorAbout />} />
          <Route path="privacy-policy" element={<DonorPrivacyPolicy />} />
          <Route path="terms-&-conditions" element={<DonorTermsAndConditions />} />
          <Route path="notifications" element={<DonorNotifications />} />
          <Route path="profile" element={<DonorProfile />} />
          <Route path="edit-profile" element={<DonorEditProfile />} />
          <Route path="my-donation" element={<DonorMyDontaion />} />
          <Route path="track-order" element={<DonorTrackingPage />} />
          <Route path="digital-receipt" element={<DigitalReceipt />} />
          <Route path="individual-edit-profile" element={<IndividualEditProfile />} />
        </Route>

        {/* Receiver */}

        <Route path="/receiver">
          <Route path="dashboard" element={<ReceiverDashboard />} />
          <Route path="about" element={<ReceiverAbout />} />
          <Route path="privacy-policy" element={<ReceiverPrivacyPolicy />} />
          <Route path="terms-&-conditions" element={<ReceiverTermsAndConditions />} />
          <Route path="notifications" element={<ReceiverNotifications />} />
          <Route path="profile" element={<ReceiverProfile />} />
          <Route path="find-food" element={<ReceiverFindFood />} />
          <Route path="digital-receipt" element={<ReceiptForm />} />
          <Route path="my-claims" element={<Myclaims />} />
        </Route>

        {/* Driver */}

        <Route path="/driver">
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="about" element={<DriverAbout />} />
          <Route path="privacy-policy" element={<DriverPrivacyPolicy />} />
          <Route path="terms-&-conditions" element={<DriverTermsAndConditions />} />
          <Route path="notifications" element={<DriverNotifications />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="my-pickups" element={<MyPickups />} />
          <Route path="pickup" element={<Pickup />}></Route>
        </Route>

        {/* Admin */}

        <Route path="/admin">
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="notification" element={<AdminNotificationPage />} />
          <Route path="user-management" element={<AdminUserManagementPage />} />
          <Route path="reviews" element={<AdminReviewManagementPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>

      </Routes>
    </Router >
  );
}

export default App;