import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { cn } from "@/lib/utils";
import './Navbar.css'

const productItems = [
  { path: '/racket', label: 'Rackets' },
  { path: '/shoes', label: 'Shoes' },
  { path: '/stringings', label: 'Strings' },
  { path: '/shuttlecocks', label: 'Shuttlecocks' },
  { path: '/grips', label: 'Grips' },
  { path: '/bags', label: 'Bags' },
] as const;

const Navbar = () => {
  const location = useLocation();
  const { email, role, logout, isAuthenticated } = useAuth();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
  };

  const isActivePath = (path: string): boolean => {
    return activePath === path;
  };

  const getNavStyles = (path: string): string => {
    return cn(
      navigationMenuTriggerStyle(),
      "transition-all duration-200",
      isActivePath(path) && "bg-blue-500 text-white hover:bg-blue-600"
    );
  };

  const adminStyles = cn(
    navigationMenuTriggerStyle(),
    "transition-all duration-200",
    "border-2 border-green-500 text-green-700 hover:bg-green-50"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-14 items-center px-4">
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className={getNavStyles('/')}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem className="lg:hidden">
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4">
                  {productItems.map(({ path, label }) => (
                    <li key={path}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={path}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActivePath(path) && "bg-blue-500 text-white hover:bg-blue-600"
                          )}
                        >
                          {label}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {productItems.map(({ path, label }) => (
                <NavigationMenuItem key={path}>
                  <NavigationMenuLink asChild>
                    <Link 
                      to={path} 
                      className={getNavStyles(path)}
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {isAuthenticated && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/orders" 
                      className={getNavStyles('/orders')}
                    >
                      My Orders
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </div>

            {role === 'admin' && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/seller" 
                    className={adminStyles}
                  >
                    Admin Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          <Link to="/cart">
            <Button 
              variant="ghost" 
              className={cn(
                "cart-button transition-all duration-200",
                isActivePath('/cart') && "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="ml-2 hidden sm:inline">Cart</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <Button variant="ghost" className="user-button">
                <User className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">{email}</span>
              </Button>
              <div className="dropdown-menu">
                <span className="user-name">{email}</span>
                <button onClick={handleLogout} className="logout-button">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button 
                variant="ghost" 
                className={cn(
                  "login-button transition-all duration-200",
                  isActivePath('/login') && "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                <span className="hidden sm:inline">Login</span>
                <User className="h-5 w-5 sm:hidden" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;