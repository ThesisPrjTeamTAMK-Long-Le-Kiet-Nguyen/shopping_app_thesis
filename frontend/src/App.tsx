import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductList from './components/ProductList'
import Navbar from './components/Header/Navbar'
import Login from './components/Login/Login'
import SignUp from './components/Login/SignUp'
import ShoppingCart from './components/ShoppingCart/ShoppingCart'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import {
  SellerPage,
  RacketManagement,
  BagManagement,
  ShoeManagement,
  StringingManagement,
  GripManagement,
  ShuttlecockManagement
} from './components/SellerPage'

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
            
            {/* Protected Admin Routes */}
            <Route path="/seller" element={
              <ProtectedRoute element={<SellerPage />} allowedRoles={['admin']} />
            } />
            <Route path="/seller/rackets" element={
              <ProtectedRoute element={<RacketManagement />} allowedRoles={['admin']} />
            } />
            <Route path="/seller/bags" element={
              <ProtectedRoute element={<BagManagement />} allowedRoles={['admin']} />
            } />
            <Route path="/seller/shoes" element={
              <ProtectedRoute element={<ShoeManagement />} allowedRoles={['admin']} />
            } />
            <Route path="/seller/stringings" element={
              <ProtectedRoute element={<StringingManagement />} allowedRoles={['admin']} />
            } />
            <Route path="/seller/grips" element={
              <ProtectedRoute element={<GripManagement />} allowedRoles={['admin']} />
            } />
            <Route path="/seller/shuttlecocks" element={
              <ProtectedRoute element={<ShuttlecockManagement />} allowedRoles={['admin']} />
            } />

            <Route path="/*" element={<ProductList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
