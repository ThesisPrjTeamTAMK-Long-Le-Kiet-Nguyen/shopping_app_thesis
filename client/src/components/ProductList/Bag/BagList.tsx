import { useState, useEffect } from 'react'
import { fetchBags } from '../../../services/productService'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bag } from '../../../types'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import LoaderUI from '@/components/LoaderUI'

type BagType = 'Backpack' | 'Rectangular Racket Bag' | '6-Piece Racket Bag' | '9-Piece Racket Bag';

interface GroupedBags {
  [type: string]: Bag[]
}

const BAG_TYPE_INFO = {
  'Backpack': {
    title: 'Badminton Backpacks',
    description: 'Versatile backpacks perfect for casual players, featuring dedicated racket compartments and ample storage for essentials.',
    icon: '🎒'
  },
  'Rectangular Racket Bag': {
    title: 'Rectangular Racket Bags',
    description: 'Compact and practical bags designed to protect your rackets while offering space for basic accessories.',
    icon: '💼'
  },
  '6-Piece Racket Bag': {
    title: '6-Piece Racket Bags',
    description: 'Professional-grade bags with multiple compartments, perfect for serious players carrying multiple rackets and gear.',
    icon: '🏸'
  },
  '9-Piece Racket Bag': {
    title: '9-Piece Racket Bags',
    description: 'Premium tournament bags with maximum storage capacity for multiple rackets, shoes, and extensive equipment.',
    icon: '🎯'
  }
} as const;

const BagList = () => {
  const [bags, setBags] = useState<Bag[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchBags();
        if (!isMounted) return;

        if (response.success && response.data) {
          setBags(response.data);
        } else {
          setError('Failed to load bags');
          toast.error('Failed to load bags');
        }
      } catch (error) {
        console.error('Error fetching bags:', error);
        if (isMounted) {
          setError('Failed to load bags. Please try again later.');
          toast.error('Failed to load bags');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupBagsByType = (bags: Bag[]): GroupedBags => {
    return bags.reduce((acc, bag) => {
      const type = bag.type as BagType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(bag);
      return acc;
    }, {} as GroupedBags);
  };

  const groupedBags = bags ? groupBagsByType(bags) : {};

  if (isLoading) {
    return <LoaderUI />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!bags || bags.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No bags available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">Badminton Bags</h2>
        <p className="text-muted-foreground">
          Professional badminton bags for all your equipment needs, from casual play to tournament demands.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedBags).map(([type, bags]) => (
          <div key={type} className="mb-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                {BAG_TYPE_INFO[type as BagType]?.icon} {BAG_TYPE_INFO[type as BagType]?.title || type}
              </h3>
              <p className="text-muted-foreground">
                {BAG_TYPE_INFO[type as BagType]?.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bags.map((bag) => (
                <Link
                  key={bag.id}
                  to={`/bags/${bag.id}`}
                  className="no-underline group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
                    <CardHeader className="p-4">
                      <div className="overflow-hidden rounded-md">
                        <img
                          src={bag.colors[0].photo}
                          alt={bag.name}
                          className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {bag.name}
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <p className="text-primary font-semibold">€{bag.price}</p>
                        <p className="text-sm text-muted-foreground">{bag.brand}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Separator className="mt-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BagList;