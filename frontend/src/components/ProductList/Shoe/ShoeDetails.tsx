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
import { Shoe, ShoeColor, ShoeSize } from '../../../types'
import LoaderUI from '@/components/LoaderUI'

const ShoeDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [shoe, setShoe] = useState<Shoe | null>(null)
  const [selectedColor, setSelectedColor] = useState<ShoeColor | null>(null)
  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null)
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
          setError('Invalid shoe ID')
          return
        }

        const response = await fetchProductById('shoes', id)
        if (!isMounted) return

        if (response.success && response.data) {
          const shoeData = response.data as Shoe
          setShoe(shoeData)
          if (shoeData.colors.length > 0) {
            const defaultColor = shoeData.colors[0]
            setSelectedColor(defaultColor)
            if (defaultColor.types && defaultColor.types.length > 0) {
              setSelectedSize(defaultColor.types[0])
            }
          }
        } else {
          setError('Failed to load shoe details')
          toast.error('Failed to load shoe details')
        }
      } catch (error) {
        console.error('Error fetching shoe details:', error)
        if (isMounted) {
          setError('Failed to load shoe details. Please try again later.')
          toast.error('Failed to load shoe details')
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

  const handleColorChange = (color: ShoeColor) => {
    setSelectedColor(color)
    if (color.types && color.types.length > 0) {
      setSelectedSize(color.types[0])
    }
  }

  const handleSizeChange = (size: ShoeSize) => {
    setSelectedSize(size)
  }

  const hasTypes = (color: ShoeColor): boolean => {
    return Array.isArray(color.types) && color.types.length > 0
  }

  const hasStock = (size: ShoeSize): boolean => {
    return typeof size.quantity === 'number' && size.quantity > 0
  }

  const handleAddToCart = async () => {
    if (!shoe || !selectedColor || !selectedSize || !hasStock(selectedSize)) return

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${shoe.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Size: ${selectedSize.size}\n` +
      `Price: $${shoe.price}`
    )

    if (confirmAdd) {
      try {
        setIsAddingToCart(true)
        const itemToAdd = {
          id: shoe.id,
          name: shoe.name,
          price: shoe.price,
          color: selectedColor.color,
          type: selectedSize.size,
          quantity: 1
        }

        const response = await cartService.addToCart(itemToAdd)
        if (response.success) {
          toast.success('Added to shopping cart', {
            description: `${shoe.name} - ${selectedColor.color} (Size ${selectedSize.size})`,
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

  if (!shoe) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Shoe not found</p>
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
                alt={`${shoe.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
              />
            </div>

            {/* Info Column */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{shoe.name}</h1>
                <p className="text-2xl font-semibold text-primary">${shoe.price}</p>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {shoe.colors.map((colorInfo, index) => (
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

              {/* Size Selection */}
              {selectedColor && hasTypes(selectedColor) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor.types.map((sizeInfo, index) => (
                      <Button
                        key={index}
                        variant={selectedSize === sizeInfo ? "default" : "outline"}
                        onClick={() => handleSizeChange(sizeInfo)}
                        disabled={!hasStock(sizeInfo)}
                        className={`
                          relative px-4 py-2 min-w-[80px]
                          ${selectedSize === sizeInfo ? 'ring-2 ring-primary ring-offset-2' : ''}
                          ${!hasStock(sizeInfo) ? 'opacity-50' : ''}
                        `}
                      >
                        {sizeInfo.size}
                        {!hasStock(sizeInfo) && (
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
                disabled={!selectedColor || !selectedSize || selectedSize.quantity === 0 || isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? (
                  'Adding to Cart...'
                ) : !selectedColor || !selectedSize || selectedSize.quantity === 0 ? (
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
                  <p>{shoe.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Series</p>
                  <p>{shoe.series}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Midsole</p>
                  <p>{shoe.midsole}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-muted-foreground">Outsole</p>
                  <p>{shoe.outsole}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShoeDetails