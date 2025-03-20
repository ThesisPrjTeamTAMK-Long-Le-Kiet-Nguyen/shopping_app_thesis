import { useState, useEffect } from 'react'
import { fetchStringings } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stringing } from '../../../types'
import { toast } from 'sonner'

const StringingList = () => {
  const [stringings, setStringings] = useState<Stringing[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStringings()
        if (response.success && response.data) {
          setStringings(response.data)
        } else {
          toast.error('Failed to load stringings')
        }
      } catch (error) {
        console.error('Error fetching stringings:', error)
        toast.error('Error loading stringings')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Badminton Strings</h2>
        <p className="text-muted-foreground">
          High-quality badminton strings offering different playing characteristics for power, control, and durability.
        </p>
      </div>

      {stringings ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stringings.map((stringing) => (
            <Link 
              key={stringing.id} 
              to={`/stringings/${stringing.id}`}
              className="no-underline group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
                <CardHeader className="p-4">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={stringing.colors[0].photo}
                      alt={stringing.name}
                      className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {stringing.name}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <p className="text-primary font-semibold">€{stringing.price}</p>
                    <p className="text-sm text-muted-foreground">{stringing.brand}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading strings...</p>
        </div>
      )}
    </div>
  )
}

export default StringingList