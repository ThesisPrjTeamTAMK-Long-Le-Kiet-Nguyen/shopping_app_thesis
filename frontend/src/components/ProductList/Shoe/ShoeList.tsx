import { useState, useEffect } from 'react'
import { fetchShoes } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shoe } from '../../../types'
import { toast } from 'sonner'

const ShoeList = () => {
  const [shoes, setShoes] = useState<Shoe[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchShoes()
        if (response.success && response.data) {
          setShoes(response.data)
        } else {
          toast.error('Failed to load shoes')
        }
      } catch (error) {
        console.error('Error fetching shoes:', error)
        toast.error('Error loading shoes')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Badminton Shoes</h2>
        <p className="text-muted-foreground">
          Professional badminton shoes designed for optimal court performance, featuring superior grip and cushioning.
        </p>
      </div>

      {shoes ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shoes.map((shoe) => (
            <Link 
              key={shoe.id} 
              to={`/shoes/${shoe.id}`}
              className="no-underline group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
                <CardHeader className="p-4">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={shoe.colors[0].photo}
                      alt={shoe.name}
                      className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {shoe.name}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-semibold">€{shoe.price}</p>
                    <p className="text-sm text-muted-foreground">{shoe.brand}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading shoes...</p>
        </div>
      )}
    </div>
  )
}

export default ShoeList