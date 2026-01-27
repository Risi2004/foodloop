import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/beforeLogin/landingPage/LandingPage";
import DonorDashboard from "./pages/afterLogin/donor/dashboard/DonorDashboard"
import LoginPage from "./pages/beforeLogin/loginPage/LoginPage";
import SignupPage from "./pages/beforeLogin/signupPage/Signup";
import ReceiverDashboard from "./pages/afterLogin/receiver/dashboard/ReceiverDashboard"

function App() {
  const isLoggedIn = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/donor/dashboard"
          element={isLoggedIn ? <DonorDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/receiver/dashboard"
          element={isLoggedIn ? <ReceiverDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;