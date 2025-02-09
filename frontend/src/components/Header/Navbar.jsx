import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/racket' ? 'active' : ''}`}>
            <Link to="/racket" className="nav-link">Rackets</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/shoes' ? 'active' : ''}`}>
            <Link to="/shoes" className="nav-link">Shoes</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/stringings' ? 'active' : ''}`}>
            <Link to="/stringings" className="nav-link">Stringings</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/shuttlecocks' ? 'active' : ''}`}>
            <Link to="/shuttlecocks" className="nav-link">Shuttlecocks</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/grips' ? 'active' : ''}`}>
            <Link to="/grips" className="nav-link">Grips</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/bags' ? 'active' : ''}`}>
            <Link to="/bags" className="nav-link">Bags</Link>
          </li>
        </ul>
        <ul className="auth-links">
          <Link to="/login">Log In</Link>
          <Link to="/cart">Shopping Bag</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar