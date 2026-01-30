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
        </Route>

        {/* Receiver */}

        <Route path="/receiver">
          <Route path="dashboard" element={<ReceiverDashboard />} />
          <Route path="about" element={<ReceiverAbout />} />
          <Route path="privacy-policy" element={<ReceiverPrivacyPolicy />} />
          <Route path="terms-&-conditions" element={<ReceiverTermsAndConditions />} />
          <Route path="notifications" element={<ReceiverNotifications />} />
          <Route path="profile" element={<ReceiverProfile />} />
        </Route>

        {/* Driver */}

        <Route path="/driver">
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="about" element={<DriverAbout />} />
          <Route path="privacy-policy" element={<DriverPrivacyPolicy />} />
          <Route path="terms-&-conditions" element={<DriverTermsAndConditions />} />
          <Route path="notifications" element={<DriverNotifications />} />
        </Route>

      </Routes>
    </Router >
  );
}

export default App;