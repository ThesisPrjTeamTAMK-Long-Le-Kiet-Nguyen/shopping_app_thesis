import { useState, useEffect } from 'react';
import { fetchShuttlecocks } from '@/services/productService';
import { Shuttlecock } from '@/types';
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

const ShuttlecockAdminList = () => {
  const [shuttlecocks, setShuttlecocks] = useState<Shuttlecock[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchShuttlecocks();
        if (!isMounted) return;

        if (response.success && response.data) {
          setShuttlecocks(response.data);
        } else {
          setError('Failed to load shuttlecocks');
          toast.error('Failed to load shuttlecocks');
        }
      } catch (error) {
        console.error('Error fetching shuttlecocks:', error);
        if (isMounted) {
          setError('Failed to load shuttlecocks. Please try again later.');
          toast.error('Failed to load shuttlecocks');
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
    <Card>
      <CardHeader>
        <CardTitle>Shuttlecock Management Reference</CardTitle>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {shuttlecocks.map((shuttlecock) => (
                <TableRow key={shuttlecock._id || shuttlecock.id}>
                  <TableCell className="font-mono text-base font-semibold">
                    {shuttlecock.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shuttlecock.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {shuttlecock.colors.map((color) => (
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
                      {shuttlecock.colors.map((color) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShuttlecockAdminList; 