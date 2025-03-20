import { useState, useEffect } from 'react'
import { fetchRackets } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Racket } from '../../../types'
import { toast } from 'sonner'

interface GroupedRackets {
  [type: string]: Racket[]
}

const RACKET_TYPE_INFO = {
  'Head Heavy': {
    title: 'Head Heavy Rackets',
    description: 'Specialized in powerful attacks and smashes. Perfect for offensive players who prioritize power in their shots.',
    icon: '🔥'
  },
  'Head Light': {
    title: 'Head Light Rackets',
    description: 'Optimized for quick movements and defensive plays. Ideal for players who focus on speed and maneuverability.',
    icon: '⚡'
  },
  'Even Balance': {
    title: 'Even Balance Rackets',
    description: 'Balanced for all-round performance. Great for players who want both control and versatility in their game.',
    icon: '⚖️'
  }
} as const

const RacketList = () => {
  const [rackets, setRackets] = useState<Racket[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRackets()
        if (response.success && response.data) {
          setRackets(response.data)
        } else {
          toast.error('Failed to load rackets')
        }
      } catch (error) {
        console.error('Error fetching rackets:', error)
        toast.error('Error loading rackets')
      }
    }

    fetchData()
  }, [])

  const groupRacketsByType = (rackets: Racket[]): GroupedRackets => {
    return rackets.reduce((acc, racket) => {
      const type = racket.racketType
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(racket)
      return acc
    }, {} as GroupedRackets)
  }

  const groupedRackets = rackets ? groupRacketsByType(rackets) : {}

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Racket Collection</h2>
      {rackets ? (
        Object.entries(RACKET_TYPE_INFO).map(([type, info]) => {
          const racketsOfType = groupedRackets[type] || []
          if (racketsOfType.length === 0) return null

          return (
            <div key={type} className="mb-12">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <span>{info.icon}</span>
                  <span>{info.title}</span>
                </h3>
                <p className="text-muted-foreground mt-2">{info.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {racketsOfType.map((racket) => (
                  <Link 
                    key={racket.id} 
                    to={`/racket/${racket.id}`}
                    className="no-underline group"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary">
                      <CardHeader className="p-4">
                        <img
                          src={racket.colors[0].photo}
                          alt={racket.name}
                          className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {racket.name}
                        </CardTitle>
                        <div className="flex justify-between items-center">
                          <p className="text-primary font-semibold">€{racket.price}</p>
                          <p className="text-sm text-muted-foreground">{racket.brand}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <Separator className="my-8" />
            </div>
          )
        })
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-lg text-muted-foreground">Loading rackets...</p>
        </div>
      )}
    </div>
  )
}

export default RacketList