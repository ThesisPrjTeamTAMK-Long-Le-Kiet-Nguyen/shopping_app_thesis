import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SellerPage = () => {
  const navigate = useNavigate();

  const productSections = [
    {
      title: 'Racket Management',
      path: '/seller/rackets',
      icon: '🏸' // We can replace these with proper icons later
    },
    {
      title: 'Bag Management',
      path: '/seller/bags',
      icon: '👜'
    },
    {
      title: 'Shoe Management',
      path: '/seller/shoes',
      icon: '👟'
    },
    {
      title: 'Stringing Management',
      path: '/seller/stringings',
      icon: '🎯'
    },
    {
      title: 'Grip Management',
      path: '/seller/grips',
      icon: '🎾'
    },
    {
      title: 'Shuttlecock Management',
      path: '/seller/shuttlecocks',
      icon: '🏸'
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
                <span>{section.icon}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate(section.path)}
              >
                Manage {section.title.split(' ')[0]}s
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerPage;