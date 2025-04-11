import { useState, useEffect } from 'react';
import { fetchShoes } from '@/services/productService';
import { Shoe } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import LoaderUI from '@/components/LoaderUI';
import { Button } from '@/components/ui/button';

const ShoeAdminList = () => {
  const [shoes, setShoes] = useState<Shoe[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchShoes();
        if (!isMounted) return;

        if (response.success && response.data) {
          setShoes(response.data);
        } else {
          setError('Failed to load shoes');
          toast.error('Failed to load shoes');
        }
      } catch (error) {
        console.error('Error fetching shoes:', error);
        if (isMounted) {
          setError('Failed to load shoes. Please try again later.');
          toast.error('Failed to load shoes');
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
    <Card>
      <CardHeader>
        <CardTitle>Shoe Management Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shoes.map((shoe) => (
                <TableRow key={shoe._id || shoe.id}>
                  <TableCell className="font-mono text-base font-semibold">
                    {shoe.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shoe.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {shoe.colors.map((color) => (
                        <div key={color._id || color.color} className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-sm px-2 py-1">
                            {color._id || 'No ID'}
                          </Badge>
                          <span>{color.color}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {shoe.colors.map((color) => (
                        <div key={color._id || color.color} className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {color.color}:
                          </div>
                          {color.types?.map((size) => (
                            <div key={size._id || size.size} className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-sm px-2 py-1">
                                {size._id || 'No ID'}
                              </Badge>
                              <span>{size.size}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {shoe.colors.map((color) => (
                        <div key={color._id || color.color} className="space-y-1">
                          {color.types?.map((size) => (
                            <div key={size._id || size.size} className="flex items-center gap-2">
                              <span>{size.size}:</span>
                              <span>{size.quantity ?? 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoeAdminList; 