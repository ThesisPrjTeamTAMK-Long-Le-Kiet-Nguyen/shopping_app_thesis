import { useState, useEffect } from 'react'
import { fetchShuttlecocks } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shuttlecock } from '../../../types'
import { toast } from 'sonner'

interface GroupedShuttlecocks {
  [brand: string]: Shuttlecock[]
}

const ShuttlecockList = () => {
  const [shuttlecocks, setShuttlecocks] = useState<Shuttlecock[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchShuttlecocks()
        if (response.success && response.data) {
          setShuttlecocks(response.data)
        } else {
          toast.error('Failed to load shuttlecocks')
        }
      } catch (error) {
        console.error('Error fetching shuttlecocks:', error)
        toast.error('Error loading shuttlecocks')
      }
    }

    fetchData()
  }, [])

  const groupShuttlecocks = (shuttlecocks: Shuttlecock[]): GroupedShuttlecocks => {
    return shuttlecocks.reduce((acc, shuttlecock) => {
      const { brand } = shuttlecock
      if (!acc[brand]) {
        acc[brand] = []
      }
      acc[brand].push(shuttlecock)
      return acc
    }, {} as GroupedShuttlecocks)
  }

  const groupedShuttlecocks = shuttlecocks ? groupShuttlecocks(shuttlecocks) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Shuttlecock Items</h2>
      {shuttlecocks ? (
        Object.entries(groupedShuttlecocks).map(([brand, shuttlecocks]) => (
          <div key={brand} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{brand}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shuttlecocks.map((shuttlecock) => (
                <Link 
                  key={shuttlecock.id} 
                  to={`/shuttlecocks/${shuttlecock.id}`}
                  className="no-underline"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <img
                        src={shuttlecock.colors[0].photo}
                        alt={shuttlecock.name}
                        className="w-full h-48 object-contain rounded-md"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">{shuttlecock.name}</CardTitle>
                      <p className="text-primary font-semibold">${shuttlecock.price}</p>
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
          <p className="text-lg text-muted-foreground">Loading shuttlecocks...</p>
        </div>
      )}
    </div>
  )
}

export default ShuttlecockList