import { useState, useEffect } from 'react'
import { fetchGrips } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Grip } from '../../../types'
import { toast } from 'sonner'

interface GroupedGrips {
  [brand: string]: Grip[]
}

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

  const groupGrips = (grips: Grip[]): GroupedGrips => {
    return grips.reduce((acc, grip) => {
      const { brand } = grip
      if (!acc[brand]) {
        acc[brand] = []
      }
      acc[brand].push(grip)
      return acc
    }, {} as GroupedGrips)
  }

  const groupedGrips = grips ? groupGrips(grips) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Grip Items</h2>
      {grips ? (
        Object.entries(groupedGrips).map(([brand, grips]) => (
          <div key={brand} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{brand}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {grips.map((grip) => (
                <Link 
                  key={grip.id} 
                  to={`/grips/${grip.id}`}
                  className="no-underline"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <img
                        src={grip.colors[0].photo}
                        alt={grip.name}
                        className="w-full h-48 object-contain rounded-md"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">{grip.name}</CardTitle>
                      <p className="text-primary font-semibold">${grip.price}</p>
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
          <p className="text-lg text-muted-foreground">Loading grips...</p>
        </div>
      )}
    </div>
  )
}

export default GripList