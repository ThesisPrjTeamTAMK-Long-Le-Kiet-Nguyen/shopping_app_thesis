import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/racket">Rackets</Link>
          </li>
          <li className="nav-item">
            <Link to="/shoes">Shoes</Link>
          </li>
          <li className="nav-item">
            <Link to="/stringings">Stringings</Link>
          </li>
          <li className="nav-item">
            <Link to="/shuttlecocks">Shuttlecocks</Link>
          </li>
          <li className="nav-item">
            <Link to="/grips">Grips</Link>
          </li>
          <li className="nav-item">
            <Link to="/bags">Bags</Link>
          </li>
        </ul>
        <div className="auth-links">
          <Link to="/login">Log In</Link>
          <Link to="/cart">Shopping Bag</Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar 