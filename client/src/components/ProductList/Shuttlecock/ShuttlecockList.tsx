import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchShuttlecocks } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuttlecock } from '../../../types'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import LoaderUI from '@/components/LoaderUI'

const ShuttlecockList = () => {
  const [shuttlecocks, setShuttlecocks] = useState<Shuttlecock[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function
  const fetchShuttlecockList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchShuttlecocks();
      if (response.success && response.data) {
        setShuttlecocks(response.data);
      } else {
        setError('Failed to load shuttlecocks');
        toast.error('Failed to load shuttlecocks');
      }
    } catch (error) {
      console.error('Error fetching shuttlecocks:', error);
      setError('Failed to load shuttlecocks. Please try again later.');
      toast.error('Failed to load shuttlecocks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShuttlecockList();
  }, [fetchShuttlecockList]);

  // Memoize shuttlecock card component
  const ShuttlecockCard = useMemo(() => {
    return ({ shuttlecock }: { shuttlecock: Shuttlecock }) => (
      <Link 
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
                loading="lazy"
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
    );
  }, []);

  if (isLoading) return <LoaderUI />;
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchShuttlecockList}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!shuttlecocks || shuttlecocks.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No shuttlecocks available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Shuttlecocks</h2>
        <p className="text-muted-foreground">
          Premium quality shuttlecocks for competitive play and training, offering consistent flight performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shuttlecocks.map((shuttlecock) => (
          <ShuttlecockCard key={shuttlecock.id} shuttlecock={shuttlecock} />
        ))}
      </div>
    </div>
  );
};

export default ShuttlecockList;