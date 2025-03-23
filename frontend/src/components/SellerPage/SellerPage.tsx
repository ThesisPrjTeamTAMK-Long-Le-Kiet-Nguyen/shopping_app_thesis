import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

const SellerPage = () => {
  const navigate = useNavigate();

  const productSections = [
    {
      title: 'Order Management',
      path: '/seller/orders',
      icon: <Package className="h-6 w-6" />,
      description: 'Manage customer orders and track their status'
    },
    {
      title: 'Racket Management',
      path: '/seller/rackets',
      icon: '🏸',
      description: 'Manage racket inventory and details'
    },
    {
      title: 'Bag Management',
      path: '/seller/bags',
      icon: '👜',
      description: 'Manage bag inventory and details'
    },
    {
      title: 'Shoe Management',
      path: '/seller/shoes',
      icon: '👟',
      description: 'Manage shoe inventory and details'
    },
    {
      title: 'Stringing Management',
      path: '/seller/stringings',
      icon: '🎯',
      description: 'Manage stringing inventory and details'
    },
    {
      title: 'Grip Management',
      path: '/seller/grips',
      icon: '🎾',
      description: 'Manage grip inventory and details'
    },
    {
      title: 'Shuttlecock Management',
      path: '/seller/shuttlecocks',
      icon: '🏸',
      description: 'Manage shuttlecock inventory and details'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">
          Manage your product inventory, track stock levels, and update product details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{section.description}</p>
              <Button
                className="w-full"
                onClick={() => navigate(section.path)}
              >
                Manage {section.title.split(' ')[0]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;