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
import PrivacyPolicy from "./pages/beforeLogin/privacyPolicy/PrivacyPolicy";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

function App() {


  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Before Signin */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* After Signin */}

        {/* Donor */}

        <Route path="/donor">
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="about" element={<DonorAbout />} />
        </Route>

        {/* Receiver */}

        <Route path="/receiver">
          <Route path="dashboard" element={<ReceiverDashboard />} />
          <Route path="about" element={<ReceiverAbout />} />
        </Route>

        {/* Driver */}

        <Route path="/driver">
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="about" element={<DriverAbout />} />
        </Route>

      </Routes>
    </Router >
  );
}

export default App;