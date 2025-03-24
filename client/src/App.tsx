import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Header/Navbar'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import ContactInfo from './components/Footer/ContactInfo'
import ProtectedRoute from './components/ProtectedRoute'
import LoaderUI from './components/LoaderUI'

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

// Optimize admin imports by importing from a single chunk
const AdminComponents = {
  SellerPage: lazy(() => import('./components/SellerPage').then(m => ({ default: m.SellerPage }))),
  OrderAdmin: lazy(() => import('./components/SellerPage').then(m => ({ default: m.OrderAdmin }))),
  RacketManagement: lazy(() => import('./components/SellerPage').then(m => ({ default: m.RacketManagement }))),
  BagManagement: lazy(() => import('./components/SellerPage').then(m => ({ default: m.BagManagement }))),
  ShoeManagement: lazy(() => import('./components/SellerPage').then(m => ({ default: m.ShoeManagement }))),
  StringingManagement: lazy(() => import('./components/SellerPage').then(m => ({ default: m.StringingManagement }))),
  GripManagement: lazy(() => import('./components/SellerPage').then(m => ({ default: m.GripManagement }))),
  ShuttlecockManagement: lazy(() => import('./components/SellerPage').then(m => ({ default: m.ShuttlecockManagement }))),
}

// Type-safe route configuration
type AdminRoute = {
  path: string
  Component: React.LazyExoticComponent<() => JSX.Element>
}

const adminRoutes: AdminRoute[] = [
  { path: '/seller', Component: AdminComponents.SellerPage },
  { path: '/seller/orders', Component: AdminComponents.OrderAdmin },
  { path: '/seller/rackets', Component: AdminComponents.RacketManagement },
  { path: '/seller/bags', Component: AdminComponents.BagManagement },
  { path: '/seller/shoes', Component: AdminComponents.ShoeManagement },
  { path: '/seller/stringings', Component: AdminComponents.StringingManagement },
  { path: '/seller/grips', Component: AdminComponents.GripManagement },
  { path: '/seller/shuttlecocks', Component: AdminComponents.ShuttlecockManagement },
]

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
