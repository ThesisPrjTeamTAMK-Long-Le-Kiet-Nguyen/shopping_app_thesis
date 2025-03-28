import { useParams } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchProductById } from '../../../services/productService'
import cartService from '../../../services/cartService'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import { Bag, Color, CartItem } from '../../../types'
import LoaderUI from '@/components/LoaderUI'

const BagDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [bag, setBag] = useState<Bag | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const fetchBagDetails = useCallback(async () => {
    if (!id) {
      setError('Invalid bag ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchProductById('bags', id);
      if (response.success && response.data) {
        const bagData = response.data as Bag;
        setBag(bagData);
        if (bagData.colors.length > 0) {
          setSelectedColor(bagData.colors[0]);
        }
      } else {
        setError('Failed to load bag details');
        toast.error('Failed to load bag details');
      }
    } catch (error) {
      console.error('Error fetching bag details:', error);
      setError('Failed to load bag details. Please try again later.');
      toast.error('Failed to load bag details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBagDetails();
  }, [fetchBagDetails]);

  // Memoize color selection handler
  const handleColorChange = useCallback((color: Color) => {
    setSelectedColor(color);
  }, []);

  // Memoize add to cart handler
  const handleAddToCart = useCallback(async () => {
    if (!bag || !selectedColor || (selectedColor.quantity ?? 0) <= 0) return;

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${bag.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Price: $${bag.price}`
    );

    if (!confirmAdd) return;

    try {
      setIsAddingToCart(true);
      const itemToAdd: CartItem = {
        id: bag.id,
        name: bag.name,
        price: bag.price,
        color: selectedColor.color,
        quantity: 1
      };

      const response = await cartService.addToCart(itemToAdd);
      if (response.success) {
        toast.success('Added to shopping cart', {
          description: `${bag.name} - ${selectedColor.color}`,
          duration: 3000,
        });
      } else {
        toast.error('Failed to add item to cart', {
          description: 'Please try again later',
        });
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart', {
        description: 'Please try again later',
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [bag, selectedColor]);

  // Memoize color buttons
  const colorButtons = useMemo(() => {
    if (!bag) return [];
    return bag.colors.map((colorInfo, index) => (
      <Button
        key={index}
        variant={selectedColor === colorInfo ? "default" : "outline"}
        onClick={() => handleColorChange(colorInfo)}
        disabled={colorInfo.quantity === 0}
        className={`
          relative px-4 py-2 min-w-[80px]
          ${selectedColor === colorInfo ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${colorInfo.quantity === 0 ? 'opacity-50' : ''}
        `}
      >
        {colorInfo.color}
        {colorInfo.quantity === 0 && (
          <Badge variant="outline" className="absolute -top-2 -right-2">
            Sold out
          </Badge>
        )}
      </Button>
    ));
  }, [bag, selectedColor, handleColorChange]);

  if (isLoading) return <LoaderUI />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchBagDetails}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!bag) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Bag not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image Column */}
            <div className="flex justify-center items-start">
              <img
                src={selectedColor?.photo}
                alt={`${bag.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
                loading="lazy"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{bag.name}</h1>
                <p className="text-2xl font-semibold text-primary">${bag.price}</p>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorButtons}
                </div>
                <Badge
                  variant={selectedColor?.quantity === 0 ? "destructive" : "secondary"}
                  className="text-sm"
                >
                  {selectedColor?.quantity === 0 ? 'Out of stock' : 'In stock'}
                </Badge>
              </div>

              <Button
                className="w-full h-12 text-lg font-medium border-2 border-blue-500
                  bg-blue-500 hover:bg-blue-600 text-white
                  hover:scale-[1.02] transform duration-200 active:scale-[0.98]
                  disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg"
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedColor || selectedColor.quantity === 0 || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? 'Adding to Cart...' : 
                 !selectedColor || selectedColor.quantity === 0 ? 'Out of Stock' : 
                 'Add to Shopping Cart'}
              </Button>
            </div>

            {/* Properties Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Specifications</h3>
              <Separator />
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Brand</p>
                  <p>{bag.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Type</p>
                  <p>{bag.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Size (cm)</p>
                  <p>{bag.size}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BagDetails;