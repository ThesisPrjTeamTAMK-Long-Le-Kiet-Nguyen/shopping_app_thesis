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
import { Stringing, Color, Type, CartItem } from '../../../types'
import LoaderUI from '@/components/LoaderUI'

const StringingDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [stringing, setStringing] = useState<Stringing | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedType, setSelectedType] = useState<Type | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const fetchStringingDetails = useCallback(async () => {
    if (!id) {
      setError('Invalid stringing ID');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchProductById('stringings', id);
      if (response.success && response.data) {
        const stringingData = response.data as Stringing;
        setStringing(stringingData);
        if (stringingData.colors.length > 0) {
          const defaultColor = stringingData.colors[0];
          setSelectedColor(defaultColor);
          if (defaultColor.types && defaultColor.types.length > 0) {
            setSelectedType(defaultColor.types[0]);
          }
        }
      } else {
        setError('Failed to load stringing details');
        toast.error('Failed to load stringing details');
      }
    } catch (error) {
      console.error('Error fetching stringing details:', error);
      setError('Failed to load stringing details. Please try again later.');
      toast.error('Failed to load stringing details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStringingDetails();
  }, [fetchStringingDetails]);

  // Memoize color selection handler
  const handleColorChange = useCallback((color: Color) => {
    setSelectedColor(color);
    if (color.types && color.types.length > 0) {
      setSelectedType(color.types[0]);
    }
  }, []);

  // Memoize type selection handler
  const handleTypeChange = useCallback((type: Type) => {
    setSelectedType(type);
  }, []);

  // Type guard function
  const hasTypes = useCallback((color: Color): color is Color & { types: Type[] } => {
    return Array.isArray(color.types) && color.types.length > 0;
  }, []);

  // Stock check function
  const hasStock = useCallback((type: Type): boolean => {
    return typeof type.quantity === 'number' && type.quantity > 0;
  }, []);

  // Memoize add to cart handler
  const handleAddToCart = useCallback(async () => {
    if (!stringing || !selectedColor || !selectedType || !hasStock(selectedType)) return;

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${stringing.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Type: ${selectedType.type}\n` +
      `Price: $${stringing.price}`
    );

    if (!confirmAdd) return;

    try {
      setIsAddingToCart(true);
      const itemToAdd: CartItem = {
        id: stringing.id,
        name: stringing.name,
        price: stringing.price,
        color: selectedColor.color,
        type: selectedType.type,
        quantity: 1
      };

      const response = await cartService.addToCart(itemToAdd);
      if (response.success) {
        toast.success('Added to shopping cart', {
          description: `${stringing.name} - ${selectedColor.color} (${selectedType.type})`,
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
  }, [stringing, selectedColor, selectedType, hasStock]);

  // Memoize color buttons
  const colorButtons = useMemo(() => {
    if (!stringing) return [];
    return stringing.colors.map((colorInfo, index) => (
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
        {(!hasTypes(colorInfo) || colorInfo.types.every(type => type.quantity === 0)) && (
          <Badge variant="outline" className="absolute -top-2 -right-2">
            Sold out
          </Badge>
        )}
      </Button>
    ));
  }, [stringing, selectedColor, handleColorChange, hasTypes]);

  // Memoize type buttons
  const typeButtons = useMemo(() => {
    if (!selectedColor || !hasTypes(selectedColor)) return [];
    return selectedColor.types.map((typeInfo, index) => (
      <Button
        key={index}
        variant={selectedType === typeInfo ? "default" : "outline"}
        onClick={() => handleTypeChange(typeInfo)}
        disabled={!hasStock(typeInfo)}
        className={`
          relative px-4 py-2 min-w-[80px]
          ${selectedType === typeInfo ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${!hasStock(typeInfo) ? 'opacity-50' : ''}
        `}
      >
        {typeInfo.type}
        {!hasStock(typeInfo) && (
          <Badge variant="outline" className="absolute -top-2 -right-2">
            Sold out
          </Badge>
        )}
      </Button>
    ));
  }, [selectedColor, selectedType, handleTypeChange, hasTypes, hasStock]);

  if (isLoading) return <LoaderUI />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchStringingDetails}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!stringing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Stringing not found</p>
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
                alt={`${stringing.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
                loading="lazy"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{stringing.name}</h1>
                <p className="text-2xl font-semibold text-primary">${stringing.price}</p>
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
                    variant={selectedColor.types.every(type => !hasStock(type)) ? "destructive" : "secondary"}
                    className="text-sm"
                  >
                    {selectedColor.types.every(type => !hasStock(type)) ? 'Out of stock' : 'In stock'}
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
                disabled={!selectedColor || !selectedType || !hasStock(selectedType) || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? 'Adding to Cart...' : 
                 !selectedColor || !selectedType || !hasStock(selectedType) ? 'Out of Stock' : 
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
                  <p>{stringing.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Series</p>
                  <p>{stringing.series}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Gauge</p>
                  <p>{stringing.gauge} mm</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Type</p>
                  <p>{stringing.type}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StringingDetails;