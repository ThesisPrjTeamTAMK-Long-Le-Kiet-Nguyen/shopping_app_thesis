import { useState, useEffect } from 'react'
import { fetchShuttlecocks } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuttlecock } from '../../../types'
import { toast } from 'sonner'

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Shuttlecocks</h2>
        <p className="text-muted-foreground">
          Premium quality shuttlecocks for competitive play and training, offering consistent flight performance.
        </p>
      </div>

      {shuttlecocks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shuttlecocks.map((shuttlecock) => (
            <Link 
              key={shuttlecock.id} 
              to={`/shuttlecocks/${shuttlecock.id}`}
              className="no-underline group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
                <CardHeader className="p-4">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={shuttlecock.colors[0].photo}
                      alt={shuttlecock.name}
                      className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {shuttlecock.name}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-semibold">€{shuttlecock.price}</p>
                    <p className="text-sm text-muted-foreground">{shuttlecock.brand}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading shuttlecocks...</p>
        </div>
      )}
    </div>
  )
}

export default ShuttlecockList