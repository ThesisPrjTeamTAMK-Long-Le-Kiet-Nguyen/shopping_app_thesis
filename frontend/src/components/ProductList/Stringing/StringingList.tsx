import { useState, useEffect } from 'react'
import { fetchStringings } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Stringing } from '../../../types'
import { toast } from 'sonner'

interface GroupedStringings {
  [brand: string]: {
    [series: string]: Stringing[]
  }
}

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

  const groupStringings = (stringings: Stringing[]): GroupedStringings => {
    return stringings.reduce((acc, stringing) => {
      const { brand, series } = stringing
      if (!acc[brand]) {
        acc[brand] = {}
      }
      if (!acc[brand][series]) {
        acc[brand][series] = []
      }
      acc[brand][series].push(stringing)
      return acc
    }, {} as GroupedStringings)
  }

  const groupedStringings = stringings ? groupStringings(stringings) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Stringing Items</h2>
      {stringings ? (
        Object.entries(groupedStringings).map(([brand, seriesMap]) => (
          <div key={brand} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{brand}</h3>
            {Object.entries(seriesMap).map(([series, stringings]) => (
              <div key={series} className="mb-6">
                <h4 className="text-xl font-medium mb-3">{series}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stringings.map((stringing) => (
                    <Link 
                      key={stringing.id} 
                      to={`/stringings/${stringing.id}`}
                      className="no-underline"
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="p-4">
                          <img
                            src={stringing.colors[0].photo}
                            alt={stringing.name}
                            className="w-full h-48 object-contain rounded-md"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg mb-2">{stringing.name}</CardTitle>
                          <p className="text-primary font-semibold">${stringing.price}</p>
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
          <p className="text-lg text-muted-foreground">Loading stringings...</p>
        </div>
      )}
    </div>
  )
}

export default StringingList