import { useState, useEffect } from 'react'
import { fetchRackets } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const RacketList = () => {
  const [rackets, setRackets] = useState(null)

  useEffect(() => {
    fetchRackets()
      .then((data) => setRackets(data))
      .catch((error) => console.error('Error fetching rackets:', error))
  }, [])

  const groupRackets = (rackets) => {
    return rackets.reduce((acc, racket) => {
      const { brand, series } = racket
      if (!acc[brand]) {
        acc[brand] = {}
      }
      if (!acc[brand][series]) {
        acc[brand][series] = []
      }
      acc[brand][series].push(racket)
      return acc
    }, {})
  }

  const groupedRackets = rackets ? groupRackets(rackets) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Racket Items</h2>
      {rackets ? (
        Object.entries(groupedRackets).map(([brand, seriesMap]) => (
          <div key={brand} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{brand}</h3>
            {Object.entries(seriesMap).map(([series, rackets]) => (
              <div key={series} className="mb-6">
                <h4 className="text-xl font-medium mb-3">{series}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {rackets.map((racket) => (
                    <Link 
                      key={racket.id} 
                      to={`/racket/${racket.id}`}
                      className="no-underline"
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="p-4">
                          <img
                            src={racket.colors[0].photo}
                            alt={racket.name}
                            className="w-full h-48 object-contain rounded-md"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg mb-2">{racket.name}</CardTitle>
                          <p className="text-primary font-semibold">${racket.price}</p>
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
          <p className="text-lg text-muted-foreground">Loading rackets...</p>
        </div>
      )}
    </div>
  )
}

export default RacketList