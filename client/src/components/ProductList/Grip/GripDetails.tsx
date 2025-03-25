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
import { Grip, Color, CartItem } from '../../../types'
import LoaderUI from '@/components/LoaderUI'

const GripDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [grip, setGrip] = useState<Grip | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const fetchGripDetails = useCallback(async () => {
    if (!id) {
      setError('Invalid grip ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchProductById('grips', id);
      if (response.success && response.data) {
        const gripData = response.data as Grip;
        setGrip(gripData);
        if (gripData.colors.length > 0) {
          setSelectedColor(gripData.colors[0]);
        }
      } else {
        setError('Failed to load grip details');
        toast.error('Failed to load grip details');
      }
    } catch (error) {
      console.error('Error fetching grip details:', error);
      setError('Failed to load grip details. Please try again later.');
      toast.error('Failed to load grip details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGripDetails();
  }, [fetchGripDetails]);

  // Memoize color selection handler
  const handleColorChange = useCallback((color: Color) => {
    setSelectedColor(color);
  }, []);

  // Memoize stock check function
  const hasStock = useCallback((color: Color): boolean => {
    return (color.quantity ?? 0) > 0;
  }, []);

  // Memoize add to cart handler
  const handleAddToCart = useCallback(async () => {
    if (!grip || !selectedColor || !hasStock(selectedColor)) return;

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${grip.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Price: $${grip.price}`
    );

    if (!confirmAdd) return;

    try {
      setIsAddingToCart(true);
      const itemToAdd: CartItem = {
        id: grip.id,
        name: grip.name,
        price: grip.price,
        color: selectedColor.color,
        quantity: 1
      };

      const response = await cartService.addToCart(itemToAdd);
      if (response.success) {
        toast.success('Added to shopping cart', {
          description: `${grip.name} - ${selectedColor.color}`,
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
  }, [grip, selectedColor, hasStock]);

  // Memoize color buttons
  const colorButtons = useMemo(() => {
    if (!grip) return [];
    return grip.colors.map((colorInfo, index) => (
      <Button
        key={index}
        variant={selectedColor === colorInfo ? "default" : "outline"}
        onClick={() => handleColorChange(colorInfo)}
        disabled={!hasStock(colorInfo)}
        className={`
          relative px-4 py-2 min-w-[80px]
          ${selectedColor === colorInfo ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${!hasStock(colorInfo) ? 'opacity-50' : ''}
        `}
      >
        {colorInfo.color}
        {!hasStock(colorInfo) && (
          <Badge variant="outline" className="absolute -top-2 -right-2">
            Sold out
          </Badge>
        )}
      </Button>
    ));
  }, [grip, selectedColor, handleColorChange, hasStock]);

  if (isLoading) return <LoaderUI />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchGripDetails}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!grip) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Grip not found</p>
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
                alt={`${grip.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
                loading="lazy"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{grip.name}</h1>
                <p className="text-2xl font-semibold text-primary">${grip.price}</p>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorButtons}
                </div>
                <Badge
                  variant={!selectedColor || !hasStock(selectedColor) ? "destructive" : "secondary"}
                  className="text-sm"
                >
                  {!selectedColor || !hasStock(selectedColor) ? 'Out of stock' : 'In stock'}
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
                disabled={!selectedColor || !hasStock(selectedColor) || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? 'Adding to Cart...' : 
                 !selectedColor || !hasStock(selectedColor) ? 'Out of Stock' : 
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
                  <p>{grip.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Thickness</p>
                  <p>{grip.thickness} mm</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Length</p>
                  <p>{grip.length} mm</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GripDetails;