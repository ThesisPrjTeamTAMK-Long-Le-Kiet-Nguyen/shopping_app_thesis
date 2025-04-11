import { useState, useEffect } from 'react';
import { fetchRackets } from '@/services/productService';
import { Racket } from '@/types';
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

const RacketAdminList = () => {
  const [rackets, setRackets] = useState<Racket[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchRackets();
        if (!isMounted) return;

        if (response.success && response.data) {
          setRackets(response.data);
        } else {
          setError('Failed to load rackets');
          toast.error('Failed to load rackets');
        }
      } catch (error) {
        console.error('Error fetching rackets:', error);
        if (isMounted) {
          setError('Failed to load rackets. Please try again later.');
          toast.error('Failed to load rackets');
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

  if (!rackets || rackets.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No rackets available</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Racket Management Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Types</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rackets.map((racket) => (
                <TableRow key={racket._id || racket.id}>
                  <TableCell className="font-mono text-base font-semibold">
                    {racket.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {racket.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {racket.colors.map((color) => (
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
                      {racket.colors.map((color) => (
                        <div key={color._id || color.color} className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            {color.color}:
                          </div>
                          {color.types?.map((type) => (
                            <div key={type._id || type.type} className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-sm px-2 py-1">
                                {type._id || 'No ID'}
                              </Badge>
                              <span>{type.type}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {racket.colors.map((color) => (
                        <div key={color._id || color.color} className="space-y-1">
                          {color.types?.map((type) => (
                            <div key={type._id || type.type} className="flex items-center gap-2">
                              <span>{type.type}:</span>
                              <span>{type.quantity ?? 'N/A'}</span>
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

export default RacketAdminList; 