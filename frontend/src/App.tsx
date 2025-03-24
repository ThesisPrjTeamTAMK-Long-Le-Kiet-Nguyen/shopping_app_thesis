import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductList from './components/ProductList'
import Navbar from './components/Header/Navbar'
import Login from './components/Login/Login'
import SignUp from './components/Login/SignUp'
import ShoppingCart from './components/ShoppingCart/ShoppingCart'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import ContactInfo from './components/Footer/ContactInfo'
import {
  SellerPage,
  RacketManagement,
  BagManagement,
  ShoeManagement,
  StringingManagement,
  GripManagement,
  ShuttlecockManagement,
  OrderAdmin
} from './components/SellerPage'
import CheckoutPage from './components/Checkout/CheckoutPage'
import Completion from './components/Checkout/Completion'
import UserOrders from './components/Checkout/UserOrders'

const App = () => {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/completion" element={<Completion />} />
              <Route path="/orders" element={<UserOrders />} />
                          
              {/* Protected Admin Routes */}
              <Route path="/seller" element={
                <ProtectedRoute element={<SellerPage />} allowedRoles={['admin']} />
              } />
              <Route path="/seller/orders" element={
                <ProtectedRoute element={<OrderAdmin />} allowedRoles={['admin']} />
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
          </main>
          <ContactInfo />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
