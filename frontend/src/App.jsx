import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductRoutes from './components/ProductList'
import Navbar from './components/Header/Navbar'
import Login from './components/Login/Login'
import SignUp from './components/Login/SignUp'
import ShoppingBag from './components/ShoppingBag/ShoppingBag'

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <h1>Product Data</h1>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<ShoppingBag />} />
          <Route path="/*" element={<ProductRoutes />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
