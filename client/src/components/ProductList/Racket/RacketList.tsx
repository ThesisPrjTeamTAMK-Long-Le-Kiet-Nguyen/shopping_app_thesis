import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchRackets } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Racket } from '../../../types'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import LoaderUI from '@/components/LoaderUI'

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

type RacketType = keyof typeof RACKET_TYPE_INFO

const RacketList = () => {
  const [rackets, setRackets] = useState<Racket[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const fetchRacketList = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchRackets()
      if (response.success && response.data) {
        setRackets(response.data)
      } else {
        setError('Failed to load rackets')
        toast.error('Failed to load rackets')
      }
    } catch (error) {
      console.error('Error fetching rackets:', error)
      setError('Failed to load rackets. Please try again later.')
      toast.error('Failed to load rackets')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRacketList()
  }, [fetchRacketList])

  // Memoize grouped rackets calculation
  const groupedRackets = useMemo(() => {
    if (!rackets) return {}
    return rackets.reduce((acc, racket) => {
      const type = racket.racketType as RacketType
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(racket)
      return acc
    }, {} as GroupedRackets)
  }, [rackets])

  // Memoize racket card component
  const RacketCard = useMemo(() => {
    return ({ racket }: { racket: Racket }) => (
      <Link 
        to={`/racket/${racket.id}`}
        className="no-underline group"
      >
        <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary">
          <CardHeader className="p-4">
            <img
              src={racket.colors[0].photo}
              alt={racket.name}
              className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
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
    )
  }, [])

  if (isLoading) return <LoaderUI />
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchRacketList}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!rackets || rackets.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No rackets available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Racket Collection</h2>
      {Object.entries(RACKET_TYPE_INFO).map(([type, info]) => {
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
                <RacketCard key={racket.id} racket={racket} />
              ))}
            </div>
            <Separator className="my-8" />
          </div>
        )
      })}
    </div>
  )
}

export default RacketList