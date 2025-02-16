import { useEffect, useState } from 'react';
import cartService from '../../services/cartService'; // Import the cart service
import './ShoppingCart.css'; // Import the new CSS file

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cartService.getCart(); // Fetch the cart items for the logged-in user
        setCartItems(response.items || []); // Set the cart items
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        setError('Failed to load cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) {
    return <p>Loading your shopping cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your shopping cart is currently empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} className="shopping-cart-item">
              <h4>{item.name}</h4>
              <p>Price: ${item.price}</p>
              <p>Color: {item.color}</p>
              <p>Type: {item.type}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;