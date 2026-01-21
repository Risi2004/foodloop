import Notification from './component/Notification/Notification.jsx'
import './App.css'
import Privacy from './component/Privacy/Privacy.jsx'
import Navbar from './component/Navbar/Navbar.jsx'
import Therms from './component/Therms/Therms.jsx'
import About from './component/About/About.jsx'

function App() {
  

  return (
    <>
      <Navbar></Navbar>
      <Therms></Therms>
      <Privacy></Privacy>
      <Notification></Notification>
      <About></About>
    </>
  )
}

export default App
