import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchStringings } from '@/services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stringing } from '@/types'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import LoaderUI from '@/components/LoaderUI'

const StringingList = () => {
  const [stringings, setStringings] = useState<Stringing[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const fetchStringingList = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchStringings()
      if (response.success && response.data) {
        setStringings(response.data)
      } else {
        setError('Failed to load stringings')
        toast.error('Failed to load stringings')
      }
    } catch (error) {
      console.error('Error fetching stringings:', error)
      setError('Failed to load stringings. Please try again later.')
      toast.error('Failed to load stringings')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStringingList()
  }, [fetchStringingList])

  // Memoize stringing card component
  const StringingCard = useMemo(() => {
    return ({ stringing }: { stringing: Stringing }) => (
      <Link 
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
                loading="lazy"
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
    )
  }, [])

  if (isLoading) return <LoaderUI />
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchStringingList}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!stringings || stringings.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No stringings available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Badminton Stringings</h2>
        <p className="text-muted-foreground">
          High-quality badminton strings offering optimal performance, durability, and control for your game.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stringings.map((stringing) => (
          <StringingCard key={stringing.id} stringing={stringing} />
        ))}
      </div>
    </div>
  )
}

export default StringingList