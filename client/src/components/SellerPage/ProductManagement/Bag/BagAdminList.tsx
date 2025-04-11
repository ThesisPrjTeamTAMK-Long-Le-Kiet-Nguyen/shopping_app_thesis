import { useState, useEffect } from 'react';
import { fetchBags } from '@/services/productService';
import { Bag } from '@/types';
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

const BagAdminList = () => {
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
    <Card>
      <CardHeader>
        <CardTitle>Bag Management Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bags.map((bag) => (
                <TableRow key={bag._id || bag.id}>
                  <TableCell className="font-mono text-base font-semibold">
                    {bag.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {bag.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {bag.colors.map((color) => (
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
                      {bag.colors.map((color) => (
                        <div key={color._id || color.color} className="flex items-center gap-2">
                          <span>{color.quantity ?? 'N/A'}</span>
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

export default BagAdminList; 