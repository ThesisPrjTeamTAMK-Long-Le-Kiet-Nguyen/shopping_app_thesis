import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchShoes } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shoe } from '../../../types'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import LoaderUI from '@/components/LoaderUI'

const ShoeList = () => {
  const [shoes, setShoes] = useState<Shoe[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function
  const fetchShoeList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchShoes();
      if (response.success && response.data) {
        setShoes(response.data);
      } else {
        setError('Failed to load shoes');
        toast.error('Failed to load shoes');
      }
    } catch (error) {
      console.error('Error fetching shoes:', error);
      setError('Failed to load shoes. Please try again later.');
      toast.error('Failed to load shoes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoeList();
  }, [fetchShoeList]);

  // Memoize shoe card component
  const ShoeCard = useMemo(() => {
    return ({ shoe }: { shoe: Shoe }) => (
      <Link 
        to={`/shoes/${shoe.id}`}
        className="no-underline group"
      >
        <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
          <CardHeader className="p-4">
            <div className="overflow-hidden rounded-md">
              <img
                src={shoe.colors[0].photo}
                alt={shoe.name}
                className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {shoe.name}
            </CardTitle>
            <div className="flex justify-between items-center">
              <p className="text-primary font-semibold">€{shoe.price}</p>
              <p className="text-sm text-muted-foreground">{shoe.brand}</p>
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
          <Button onClick={fetchShoeList}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!shoes || shoes.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No shoes available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Badminton Shoes</h2>
        <p className="text-muted-foreground">
          Professional badminton shoes designed for optimal court performance, featuring superior grip and cushioning.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shoes.map((shoe) => (
          <ShoeCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
};

export default ShoeList;