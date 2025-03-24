import { useState, useEffect } from 'react';
import { fetchGrips } from '@/services/productService';
import { Grip } from '@/types';
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

const GripAdminList = () => {
  const [grips, setGrips] = useState<Grip[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchGrips();
        if (!isMounted) return;

        if (response.success && response.data) {
          setGrips(response.data);
        } else {
          setError('Failed to load grips');
          toast.error('Failed to load grips');
        }
      } catch (error) {
        console.error('Error fetching grips:', error);
        if (isMounted) {
          setError('Failed to load grips. Please try again later.');
          toast.error('Failed to load grips');
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

  if (!grips || grips.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No grips available</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grip Management Reference</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Colors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grips.map((grip) => (
                <TableRow key={grip._id || grip.id}>
                  <TableCell className="font-mono text-base font-semibold">
                    {grip.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {grip.name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {grip.colors.map((color) => (
                        <div key={color._id || color.color} className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-sm px-2 py-1">
                            {color._id || 'No ID'}
                          </Badge>
                          <span>{color.color}</span>
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

export default GripAdminList; 