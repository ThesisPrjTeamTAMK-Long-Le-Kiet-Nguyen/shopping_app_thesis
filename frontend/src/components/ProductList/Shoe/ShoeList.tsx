import { useState, useEffect } from 'react'
import { fetchShoes } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shoe } from '../../../types'
import { toast } from 'sonner'

interface GroupedShoes {
  [brand: string]: {
    [series: string]: Shoe[]
  }
}

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

  const groupShoes = (shoes: Shoe[]): GroupedShoes => {
    return shoes.reduce((acc, shoe) => {
      const { brand, series } = shoe
      if (!acc[brand]) {
        acc[brand] = {}
      }
      if (!acc[brand][series]) {
        acc[brand][series] = []
      }
      acc[brand][series].push(shoe)
      return acc
    }, {} as GroupedShoes)
  }

  const groupedShoes = shoes ? groupShoes(shoes) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Shoe Items</h2>
      {shoes ? (
        Object.entries(groupedShoes).map(([brand, seriesMap]) => (
          <div key={brand} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{brand}</h3>
            {Object.entries(seriesMap).map(([series, shoes]) => (
              <div key={series} className="mb-6">
                <h4 className="text-xl font-medium mb-3">{series}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {shoes.map((shoe) => (
                    <Link 
                      key={shoe.id} 
                      to={`/shoes/${shoe.id}`}
                      className="no-underline"
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="p-4">
                          <img
                            src={shoe.colors[0].photo}
                            alt={shoe.name}
                            className="w-full h-48 object-contain rounded-md"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg mb-2">{shoe.name}</CardTitle>
                          <p className="text-primary font-semibold">${shoe.price}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Separator className="my-8" />
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading shoes...</p>
        </div>
      )}
    </div>
  )
}

export default ShoeList