import { Link, useLocation } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
              <Link to="/">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* All Product Types */}
            <NavigationMenuItem>
              <Link to="/racket">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/racket' ? 'nav-active' : ''}`}
                >
                  Rackets
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/shoes">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/shoes' ? 'nav-active' : ''}`}
                >
                  Shoes
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/stringings">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/stringings' ? 'nav-active' : ''}`}
                >
                  Stringings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/shuttlecocks">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/shuttlecocks' ? 'nav-active' : ''}`}
                >
                  Shuttlecocks
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/grips">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/grips' ? 'nav-active' : ''}`}
                >
                  Grips
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/bags">
                <NavigationMenuLink
                  className={`nav-link ${location.pathname === '/bags' ? 'nav-active' : ''}`}
                >
                  Bags
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Admin Section */}
            {role === 'admin' && (
              <NavigationMenuItem>
                <Link to="/seller">
                  <NavigationMenuLink className="modify-button">
                    Admin Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side: Cart and User */}
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/cart" className="cart-link">
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
            <Link to="/login" className="login-link">
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