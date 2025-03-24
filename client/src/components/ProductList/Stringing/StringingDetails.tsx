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
import { Stringing, Color, CartItem } from '../../../types'

const StringingDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [stringing, setStringing] = useState<Stringing | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return
        const response = await fetchProductById('stringings', id)
        if (response.success && response.data) {
          const stringingData = response.data as Stringing
          setStringing(stringingData)
          if (stringingData.colors.length > 0) {
            setSelectedColor(stringingData.colors[0])
          }
        }
      } catch (error) {
        console.error('Error fetching stringing details:', error)
        toast.error('Failed to load stringing details')
      }
    }

    fetchData()
  }, [id])

  const handleColorChange = (color: Color) => {
    setSelectedColor(color)
  }

  const hasStock = (color: Color): boolean => {
    return typeof color.quantity === 'number' && color.quantity > 0
  }

  const handleAddToCart = async () => {
    if (!stringing || !selectedColor || !hasStock(selectedColor)) return

    const confirmAdd = window.confirm(
      `Are you sure you want to add this item to your cart?\n\n` +
      `${stringing.name}\n` +
      `Color: ${selectedColor.color}\n` +
      `Price: $${stringing.price}`
    )

    if (confirmAdd) {
      try {
        setIsAddingToCart(true)
        const itemToAdd: CartItem = {
          id: stringing.id,
          name: stringing.name,
          price: stringing.price,
          color: selectedColor.color,
          type: stringing.type,
          quantity: 1
        }

        const response = await cartService.addToCart(itemToAdd)
        if (response.success) {
          toast.success('Added to shopping cart', {
            description: `${stringing.name} - ${selectedColor.color}`,
            duration: 3000,
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

  if (!stringing) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Loading stringing details...</p>
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
                alt={`${stringing.name} in ${selectedColor?.color}`}
                className="w-full max-w-md rounded-lg object-contain"
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
                  {stringing.colors.map((colorInfo, index) => (
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
                  ))}
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
                {isAddingToCart ? (
                  'Adding to Cart...'
                ) : !selectedColor || !hasStock(selectedColor) ? (
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
  )
}

export default StringingDetails