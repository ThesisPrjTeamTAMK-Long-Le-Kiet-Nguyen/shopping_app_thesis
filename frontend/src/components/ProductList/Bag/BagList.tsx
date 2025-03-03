import { useState, useEffect } from 'react'
import { fetchBags } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bag } from '../../../types'
import { toast } from 'sonner'

interface GroupedBags {
  [brand: string]: Bag[]
}

const BagList = () => {
  const [bags, setBags] = useState<Bag[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBags()
        if (response.success && response.data) {
          setBags(response.data)
        } else {
          toast.error('Failed to load bags')
        }
      } catch (error) {
        console.error('Error fetching bags:', error)
        toast.error('Error loading bags')
      }
    }

    fetchData()
  }, [])

  const groupBags = (bags: Bag[]): GroupedBags => {
    return bags.reduce((acc, bag) => {
      const { brand } = bag
      if (!acc[brand]) {
        acc[brand] = []
      }
      acc[brand].push(bag)
      return acc
    }, {} as GroupedBags)
  }

  const groupedBags = bags ? groupBags(bags) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Bag Items</h2>
      {bags ? (
        Object.entries(groupedBags).map(([brand, bags]) => (
          <div key={brand} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{brand}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bags.map((bag) => (
                <Link
                  key={bag.id}
                  to={`/bags/${bag.id}`}
                  className="no-underline"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <img
                        src={bag.colors[0].photo}
                        alt={bag.name}
                        className="w-full h-48 object-contain rounded-md"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">{bag.name}</CardTitle>
                      <p className="text-primary font-semibold">${bag.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Separator className="my-8" />
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading bags...</p>
        </div>
      )}
    </div>
  )
}

export default BagList