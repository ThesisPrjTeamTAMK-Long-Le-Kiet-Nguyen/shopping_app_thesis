import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchData } from '../../services/productService'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import RacketList from './Racket/RacketList'
import RacketDetails from './Racket/RacketDetails'
import ShoeList from './Shoe/ShoeList'
import ShoeDetails from './Shoe/ShoeDetails'
import StringingList from './Stringing/StringingList'
import StringingDetails from './Stringing/StringingDetails'
import ShuttlecockList from './Shuttlecock/ShuttlecockList'
import ShuttlecockDetails from './Shuttlecock/ShuttlecockDetails'
import GripList from './Grip/GripList'
import GripDetails from './Grip/GripDetails'
import BagList from './Bag/BagList'
import BagDetails from './Bag/BagDetails'
import LoaderUI from '@/components/LoaderUI'

const MARKETING_IMAGES = [
  {
    image: "https://github.com/ThesisPrjTeamTAMK-Long-Le-Kiet-Nguyen/picture-assets/blob/main/banner1.jpeg?raw=true",
    alt: "A new dawn for Doubles"
  },
  {
    image: "https://github.com/ThesisPrjTeamTAMK-Long-Le-Kiet-Nguyen/picture-assets/blob/main/banner2.jpg?raw=true",
    alt: "V for Victory, Ready to Win"
  },
  {
    image: "https://github.com/ThesisPrjTeamTAMK-Long-Le-Kiet-Nguyen/picture-assets/blob/main/banner3.jpeg?raw=true",
    alt: "Fail as fast as you can"
  },
  {
    image: "https://github.com/ThesisPrjTeamTAMK-Long-Le-Kiet-Nguyen/picture-assets/blob/main/banner4.png?raw=true",
    alt: "Velocity Rising"
  },
];

type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Memoized FeaturedProductCard component
const FeaturedProductCard = ({ product }: { product: FeaturedProduct }) => (
  <Link
    to={`/${product.category}/${product.id}`}
    className="no-underline group"
  >
    <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-primary h-full">
      <CardHeader className="p-4">
        <div className="overflow-hidden rounded-md">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </CardTitle>
        <p className="text-primary font-semibold">€{product.price}</p>
      </CardContent>
    </Card>
  </Link>
);

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchData();
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch products');
      }

      const { rackets, shoes, stringings, shuttlecocks } = response.data;
      const allProducts: FeaturedProduct[] = [
        ...(rackets?.slice(0, 3).map(racket => ({
          id: racket.id,
          name: racket.name,
          price: racket.price,
          image: racket.colors[0].photo,
          category: 'racket'
        })) ?? []),
        ...(shoes?.slice(0, 3).map(shoe => ({
          id: shoe.id,
          name: shoe.name,
          price: shoe.price,
          image: shoe.colors[0].photo,
          category: 'shoes'
        })) ?? []),
        ...(stringings?.slice(0, 3).map(string => ({
          id: string.id,
          name: string.name,
          price: string.price,
          image: string.colors[0].photo,
          category: 'stringings'
        })) ?? []),
        ...(shuttlecocks?.slice(0, 3).map(shuttle => ({
          id: shuttle.id,
          name: shuttle.name,
          price: shuttle.price,
          image: shuttle.colors[0].photo,
          category: 'shuttlecocks'
        })) ?? [])
      ];

      if (allProducts.length === 0) {
        setError('No featured products available');
        return;
      }

      // Shuffle and limit to 12 products
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5).slice(0, 12);
      setFeaturedProducts(shuffled);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setError('Failed to load featured products. Please try again later.');
      toast.error('Failed to load featured products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Memoize navigation handler
  const navigate = useCallback((newDirection: 'prev' | 'next') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(newDirection === 'prev' ? 'left' : 'right');
    
    setCurrentIndex(prev => {
      if (newDirection === 'prev') {
        return prev === 0 ? MARKETING_IMAGES.length - 1 : prev - 1;
      } else {
        return prev === MARKETING_IMAGES.length - 1 ? 0 : prev + 1;
      }
    });

    setTimeout(() => setIsAnimating(false), 750);
  }, [isAnimating]);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      navigate('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Memoize current image indices
  const { currentImage, prevIndex, nextIndex } = useMemo(() => ({
    currentImage: MARKETING_IMAGES[currentIndex],
    prevIndex: currentIndex === 0 ? MARKETING_IMAGES.length - 1 : currentIndex - 1,
    nextIndex: currentIndex === MARKETING_IMAGES.length - 1 ? 0 : currentIndex + 1
  }), [currentIndex]);

  // Memoize slider dots
  const sliderDots = useMemo(() => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {MARKETING_IMAGES.map((_, index) => (
        <button
          key={index}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === currentIndex 
              ? 'bg-white w-6' 
              : 'bg-white/50 hover:bg-white/80 w-2',
            isAnimating ? 'scale-95' : 'scale-100'
          )}
          onClick={() => {
            if (index !== currentIndex) {
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }
          }}
        />
      ))}
    </div>
  ), [currentIndex, isAnimating, setDirection]);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Badminton Shop</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our premium selection of badminton equipment, from professional rackets to essential accessories.
            Everything you need to elevate your game.
          </p>
        </div>

        {/* Marketing Image Slider */}
        <div className="relative mb-16 group">
          <div className="relative h-[600px] overflow-hidden rounded-xl">
            {/* Previous Image */}
            <img
              src={MARKETING_IMAGES[prevIndex].image}
              alt={MARKETING_IMAGES[prevIndex].alt}
              className={cn(
                "absolute w-full h-full object-cover transition-transform duration-700",
                direction === 'right' ? '-translate-x-full' : 'translate-x-full',
                isAnimating ? 'opacity-0' : 'opacity-0'
              )}
            />
            
            {/* Current Image */}
            <img
              src={currentImage.image}
              alt={currentImage.alt}
              className={cn(
                "absolute w-full h-full object-cover transition-all duration-700",
                isAnimating && (
                  direction === 'right' 
                    ? 'animate-slide-left' 
                    : 'animate-slide-right'
                )
              )}
            />

            {/* Next Image */}
            <img
              src={MARKETING_IMAGES[nextIndex].image}
              alt={MARKETING_IMAGES[nextIndex].alt}
              className={cn(
                "absolute w-full h-full object-cover transition-transform duration-700",
                direction === 'right' ? 'translate-x-full' : '-translate-x-full',
                isAnimating ? 'opacity-0' : 'opacity-0'
              )}
            />

            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => navigate('prev')}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => navigate('next')}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {sliderDots}
        </div>

        {/* Featured Products */}
        {isLoading ? (
          <LoaderUI />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchFeaturedProducts}>Try Again</Button>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ProductList = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/racket" element={<RacketList />} />
      <Route path="/racket/:id" element={<RacketDetails />} />
      <Route path="/shoes" element={<ShoeList />} />
      <Route path="/shoes/:id" element={<ShoeDetails />} />
      <Route path="/stringings" element={<StringingList />} />
      <Route path="/stringings/:id" element={<StringingDetails />} />
      <Route path="/shuttlecocks" element={<ShuttlecockList />} />
      <Route path="/shuttlecocks/:id" element={<ShuttlecockDetails />} />
      <Route path="/grips" element={<GripList />} />
      <Route path="/grips/:id" element={<GripDetails />} />
      <Route path="/bags" element={<BagList />} />
      <Route path="/bags/:id" element={<BagDetails />} />
    </Routes>
  )
}

export default ProductList