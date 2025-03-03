import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductList from './components/ProductList'
import Navbar from './components/Header/Navbar'
import Login from './components/Login/Login'
import SignUp from './components/Login/SignUp'
import ShoppingCart from './components/ShoppingCart/ShoppingCart'
import SellerPage from './components/SellerPage/SellerPage'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/seller" element={<ProtectedRoute element={<SellerPage />} allowedRoles={['admin']} />} />
            <Route path="/*" element={<ProductList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
