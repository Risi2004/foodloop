import Notification from './component/Notification/Notification.jsx'
import './App.css'
import Privacy from './component/Privacy/Privacy.jsx'
import Navbar from './component/Navbar/Navbar.jsx'
import Therms from './component/Therms/Therms.jsx'

function App() {
  

  return (
    <>
      <Navbar></Navbar>
      <Therms></Therms>
      <Privacy></Privacy>
      <Notification></Notification>
    </>
  )
}

export default App
