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
import { Racket, Color, Type, CartItem } from '../../../types'
import LoaderUI from '@/components/LoaderUI'

const RacketDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [racket, setRacket] = useState<Racket | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedType, setSelectedType] = useState<Type | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const fetchRacketDetails = useCallback(async () => {
    if (!id) {
      setError('Invalid racket ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchProductById('rackets', id);
      if (response.success && response.data) {
        const racketData = response.data as Racket;
        setRacket(racketData);
        if (racketData.colors.length > 0) {
          const defaultColor = racketData.colors[0];
          setSelectedColor(defaultColor);
          const defaultType = defaultColor.types?.find(type => type.type === "4ug5") || defaultColor.types?.[0];
          setSelectedType(defaultType || null);
        }
      } else {
        setError('Failed to load racket details');
        toast.error('Failed to load racket details');
      }
    } catch (error) {
      console.error('Error fetching racket details:', error);
      setError('Failed to load racket details. Please try again later.');
      toast.error('Failed to load racket details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRacketDetails();
  }, [fetchRacketDetails]);

  // Memoize color selection handler
  const handleColorChange = useCallback((color: Color) => {
    setSelectedColor(color);
    const defaultType = color.types?.find(type => type.type === "4ug5") || color.types?.[0];
    setSelectedType(defaultType || null);
  }, []);

  // Memoize type selection handler
  const handleTypeChange = useCallback((type: Type) => {
    setSelectedType(type);
  }, []);

  // Memoize add to cart handler
  const handleAddToCart = useCallback(async () => {
    if (!racket || !selectedColor || !selectedType || (selectedType.quantity ?? 0) <= 0) return;

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${racket.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Type: ${selectedType.type}\n` +
      `Price: $${racket.price}`
    );

    if (!confirmAdd) return;

    try {
      setIsAddingToCart(true);
      const itemToAdd: CartItem = {
        id: racket.id,
        name: racket.name,
        price: racket.price,
        color: selectedColor.color,
        type: selectedType.type,
        quantity: 1
      };

      const response = await cartService.addToCart(itemToAdd);
      if (response.success) {
        toast.success('Added to shopping cart', {
          description: `${racket.name} - ${selectedColor.color} (${selectedType.type})`,
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
  }, [racket, selectedColor, selectedType]);

  // Type guard function
  const hasTypes = useCallback((color: Color): color is Color & { types: Type[] } => {
    return Array.isArray(color.types) && color.types.length > 0;
  }, []);

  // Memoize color buttons
  const colorButtons = useMemo(() => {
    if (!racket) return [];
    return racket.colors.map((colorInfo, index) => (
      <Button
        key={index}
        variant={selectedColor === colorInfo ? "default" : "outline"}
        onClick={() => handleColorChange(colorInfo)}
        disabled={!hasTypes(colorInfo) || colorInfo.types.every(type => type.quantity === 0)}
        className={`
          relative px-4 py-2 min-w-[80px]
          ${selectedColor === colorInfo ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${!hasTypes(colorInfo) || colorInfo.types.every(type => type.quantity === 0) ? 'opacity-50' : ''}
        `}
      >
        {colorInfo.color}
      </Button>
    ));
  }, [racket, selectedColor, handleColorChange, hasTypes]);

  // Memoize type buttons
  const typeButtons = useMemo(() => {
    if (!selectedColor || !hasTypes(selectedColor)) return [];
    return selectedColor.types.map((typeInfo, index) => (
      <Button
        key={index}
        variant={selectedType === typeInfo ? "default" : "outline"}
        onClick={() => handleTypeChange(typeInfo)}
        disabled={typeInfo.quantity === 0}
        className={`
          relative px-4 py-2 min-w-[80px]
          ${selectedType === typeInfo ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${typeInfo.quantity === 0 ? 'opacity-50' : ''}
        `}
      >
        <span>{typeInfo.type}</span>
        {typeInfo.quantity === 0 && (
          <Badge variant="outline" className="absolute -top-2 -right-2">
            Sold out
          </Badge>
        )}
      </Button>
    ));
  }, [selectedColor, selectedType, handleTypeChange, hasTypes]);

  if (isLoading) return <LoaderUI />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchRacketDetails}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!racket) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Racket not found</p>
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
                alt={`${racket.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
                loading="lazy"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{racket.name}</h1>
                <p className="text-2xl font-semibold text-primary">${racket.price}</p>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorButtons}
                </div>
              </div>

              {/* Type Selection */}
              {selectedColor && hasTypes(selectedColor) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {typeButtons}
                  </div>
                  <Badge
                    variant={selectedColor.types.every(type => type.quantity === 0) ? "destructive" : "secondary"}
                    className="text-sm"
                  >
                    {selectedColor.types.every(type => type.quantity === 0) ? 'Out of stock' : 'In stock'}
                  </Badge>
                </div>
              )}

              <Button
                className="w-full h-12 text-lg font-medium border-2 border-blue-500
                  bg-blue-500 hover:bg-blue-600 text-white
                  hover:scale-[1.02] transform duration-200 active:scale-[0.98]
                  disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed
                  shadow-md hover:shadow-lg"
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedType || (selectedType.quantity ?? 0) === 0 || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? 'Adding to Cart...' : 
                 !selectedType || (selectedType.quantity ?? 0) === 0 ? 'Out of Stock' : 
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
                  <p>{racket.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Series</p>
                  <p>{racket.series}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Type</p>
                  <p>{racket.racketType}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Flexibility</p>
                  <p>{racket.flexibility}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Material</p>
                  <p>{racket.material}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Balance Point</p>
                  <p>{racket.balancePoint} mm</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Cover Included</p>
                  <p>{racket.cover ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RacketDetails;