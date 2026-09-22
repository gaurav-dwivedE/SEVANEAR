import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Application from './pages/Application'
import Address from './pages/Address'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/applications" element={<Application />} />
      <Route path="/addresses" element={<Address />} />


    </Routes>  
  )
}

export default App