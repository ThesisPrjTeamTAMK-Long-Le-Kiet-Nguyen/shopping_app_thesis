import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user } = useAuth();

  return (
    {user?.role === 'admin' && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Admin</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/admin/products">Products</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/orders">Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/users">Users</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  );
};

export default Navbar; 