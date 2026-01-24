import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/beforeLogin/landingPage/LandingPage"
import Dashboard from "./pages/afterLogin/dashboard/Dashboard"

function App() {
  const isLoggedIn = false;
  return (
    <>
      <Router>
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<LandingPage />} />
            </>
          ) : (
            <>
              <Route path="/Dashboard" element={<Dashboard />} />
            </>
          )}
        </Routes> 
      </Router>
    </>
  )
}

export default App
