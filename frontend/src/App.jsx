import { BrowserRouter as Router } from 'react-router-dom'
import ProductRoutes from './components/ProductList'
import Navbar from './components/Header/Navbar'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <h1>Product Data</h1>
        <ProductRoutes />
      </div>
    </Router>
  )
}

export default App
