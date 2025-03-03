import { Link, useLocation } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import './Navbar.css'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-14 items-center px-4">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4">
            {/* Home */}
            <NavigationMenuItem>
              <Link 
                to="/" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/' ? 'nav-active' : ''}`}
              >
                Home
              </Link>
            </NavigationMenuItem>

            {/* All Product Types */}
            <NavigationMenuItem>
              <Link 
                to="/racket" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/racket' ? 'nav-active' : ''}`}
              >
                Rackets
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/shoes" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/shoes' ? 'nav-active' : ''}`}
              >
                Shoes
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/stringings" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/stringings' ? 'nav-active' : ''}`}
              >
                Stringings
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/shuttlecocks" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/shuttlecocks' ? 'nav-active' : ''}`}
              >
                Shuttlecocks
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/grips" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/grips' ? 'nav-active' : ''}`}
              >
                Grips
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link 
                to="/bags" 
                className={`${navigationMenuTriggerStyle()} ${location.pathname === '/bags' ? 'nav-active' : ''}`}
              >
                Bags
              </Link>
            </NavigationMenuItem>

            {/* Admin Section */}
            {role === 'admin' && (
              <NavigationMenuItem>
                <Link 
                  to="/seller" 
                  className={`${navigationMenuTriggerStyle()} modify-button`}
                >
                  Admin Dashboard
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side: Cart and User */}
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" className="cart-button">
              <ShoppingCart className="h-5 w-5" />
              <span className="ml-2">Cart</span>
            </Button>
          </Link>

          {token ? (
            <div className="user-menu">
              <Button variant="ghost" className="user-button">
                <User className="h-5 w-5" />
                <span className="ml-2">{username}</span>
              </Button>
              <div className="dropdown-menu">
                <span className="user-name">{username}</span>
                <button onClick={handleLogout} className="logout-button">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="login-button">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar