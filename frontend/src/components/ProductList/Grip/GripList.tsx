import { useState, useEffect } from 'react'
import { fetchGrips } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grip } from '../../../types'
import { toast } from 'sonner'

const GripList = () => {
  const [grips, setGrips] = useState<Grip[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGrips()
        if (response.success && response.data) {
          setGrips(response.data)
        } else {
          toast.error('Failed to load grips')
        }
      } catch (error) {
        console.error('Error fetching grips:', error)
        toast.error('Error loading grips')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Badminton Grips</h2>
        <p className="text-muted-foreground">
          High-quality replacement grips providing comfort, sweat absorption, and optimal racket control.
        </p>
      </div>

      {grips ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {grips.map((grip) => (
            <Link 
              key={grip.id} 
              to={`/grips/${grip.id}`}
              className="no-underline group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
                <CardHeader className="p-4">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={grip.colors[0].photo}
                      alt={grip.name}
                      className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {grip.name}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-semibold">€{grip.price}</p>
                    <p className="text-sm text-muted-foreground">{grip.brand}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading grips...</p>
        </div>
      )}
    </div>
  )
}

export default GripList