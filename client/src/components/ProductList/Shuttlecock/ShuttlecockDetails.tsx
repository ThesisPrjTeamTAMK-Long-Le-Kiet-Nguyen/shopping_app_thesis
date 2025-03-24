import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProductById } from '../../../services/productService'
import cartService from '../../../services/cartService'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import { Shuttlecock, Color, Type, CartItem } from '../../../types'
import LoaderUI from '@/components/LoaderUI'

const ShuttlecockDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [shuttlecock, setShuttlecock] = useState<Shuttlecock | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedType, setSelectedType] = useState<Type | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          setError('Invalid shuttlecock ID')
          return
        }

        const response = await fetchProductById('shuttlecocks', id)
        if (!isMounted) return

        if (response.success && response.data) {
          const shuttlecockData = response.data as Shuttlecock
          setShuttlecock(shuttlecockData)
          if (shuttlecockData.colors.length > 0) {
            const defaultColor = shuttlecockData.colors[0]
            setSelectedColor(defaultColor)
            if (defaultColor.types && defaultColor.types.length > 0) {
              setSelectedType(defaultColor.types[0])
            }
          }
        } else {
          setError('Failed to load shuttlecock details')
          toast.error('Failed to load shuttlecock details')
        }
      } catch (error) {
        console.error('Error fetching shuttlecock details:', error)
        if (isMounted) {
          setError('Failed to load shuttlecock details. Please try again later.')
          toast.error('Failed to load shuttlecock details')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleColorChange = (color: Color) => {
    setSelectedColor(color)
    if (color.types && color.types.length > 0) {
      setSelectedType(color.types[0])
    }
  }

  const handleTypeChange = (type: Type) => {
    setSelectedType(type)
  }

  const hasTypes = (color: Color): color is Color & { types: Type[] } => {
    return Array.isArray(color.types) && color.types.length > 0
  }

  const hasStock = (type: Type): boolean => {
    return typeof type.quantity === 'number' && type.quantity > 0
  }

  const handleAddToCart = async () => {
    if (!shuttlecock || !selectedColor || !selectedType || !hasStock(selectedType)) return

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${shuttlecock.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Type: ${selectedType.type}\n` +
      `Price: $${shuttlecock.price}`
    )

    if (confirmAdd) {
      try {
        setIsAddingToCart(true)
        const itemToAdd: CartItem = {
          id: shuttlecock.id,
          name: shuttlecock.name,
          price: shuttlecock.price,
          color: selectedColor.color,
          type: selectedType.type,
          quantity: 1
        }

        const response = await cartService.addToCart(itemToAdd)
        if (response.success) {
          toast.success('Added to shopping cart', {
            description: `${shuttlecock.name} - ${selectedColor.color} (${selectedType.type})`,
            duration: 3000,
          })
        } else {
          toast.error('Failed to add item to cart', {
            description: 'Please try again later',
          })
        }
      } catch (error) {
        console.error('Failed to add item to cart:', error)
        toast.error('Failed to add item to cart', {
          description: 'Please try again later',
        })
      } finally {
        setIsAddingToCart(false)
      }
    }
  }

  if (isLoading) {
    return <LoaderUI />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!shuttlecock) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Shuttlecock not found</p>
        </div>
      </div>
    )
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
                alt={`${shuttlecock.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{shuttlecock.name}</h1>
                <p className="text-2xl font-semibold text-primary">${shuttlecock.price}</p>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {shuttlecock.colors.map((colorInfo, index) => (
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
                  ))}
                </div>
              </div>

              {/* Type Selection */}
              {selectedColor && hasTypes(selectedColor) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.types.map((typeInfo, index) => (
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
                    ))}
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
                {isAddingToCart ? (
                  'Adding to Cart...'
                ) : !selectedColor || !selectedType || !hasStock(selectedType) ? (
                  'Out of Stock'
                ) : (
                  'Add to Shopping Cart'
                )}
              </Button>
            </div>

            {/* Properties Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Specifications</h3>
              <Separator />
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Brand</p>
                  <p>{shuttlecock.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Feather Type</p>
                  <p>{shuttlecock.featherType}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Units Per Tube</p>
                  <p>{shuttlecock.unitsPerTube}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShuttlecockDetails