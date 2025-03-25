import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Header/Navbar'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import ContactInfo from './components/Footer/ContactInfo'
import ProtectedRoute from './components/ProtectedRoute'
import LoaderUI from './components/LoaderUI'
import { adminRoutes } from './components/SellerPage/routes'

// Group routes by feature for better code organization
const PublicRoutes = {
  ProductList: lazy(() => import('./components/ProductList')),
  Login: lazy(() => import('./components/Login/Login')),
  SignUp: lazy(() => import('./components/Login/SignUp')),
}

const ShoppingRoutes = {
  Cart: lazy(() => import('./components/ShoppingCart/ShoppingCart')),
  Checkout: lazy(() => import('./components/Checkout/CheckoutPage')),
  Completion: lazy(() => import('./components/Checkout/Completion')),
  Orders: lazy(() => import('./components/Checkout/UserOrders')),
}

const App = () => {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoaderUI />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoutes.Login />} />
                <Route path="/signup" element={<PublicRoutes.SignUp />} />

                {/* Shopping Routes */}
                <Route path="/cart" element={<ShoppingRoutes.Cart />} />
                <Route path="/checkout" element={<ShoppingRoutes.Checkout />} />
                <Route path="/completion" element={<ShoppingRoutes.Completion />} />
                <Route path="/orders" element={<ShoppingRoutes.Orders />} />
                
                {/* Admin Routes */}
                {adminRoutes.map(({ path, Component }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoute
                        element={<Component />}
                        allowedRoles={['admin']}
                      />
                    }
                  />
                ))}

                {/* Default Route */}
                <Route path="/*" element={<PublicRoutes.ProductList />} />
              </Routes>
            </Suspense>
          </main>
          <ContactInfo />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
