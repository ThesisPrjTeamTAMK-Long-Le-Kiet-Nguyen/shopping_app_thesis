import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const SellerPage = () => {
  const navigate = useNavigate();

  const productSections = [
    {
      title: 'Racket Management',
      description: 'Manage racket inventory, add new rackets, update stock',
      path: '/seller/rackets',
      icon: '🏸' // We can replace these with proper icons later
    },
    {
      title: 'Bag Management',
      description: 'Manage bag inventory, add new bags, update stock',
      path: '/seller/bags',
      icon: '👜'
    },
    {
      title: 'Shoe Management',
      description: 'Manage shoe inventory, add new shoes, update stock',
      path: '/seller/shoes',
      icon: '👟'
    },
    {
      title: 'Stringing Management',
      description: 'Manage stringing inventory, add new strings, update stock',
      path: '/seller/stringings',
      icon: '🎯'
    },
    {
      title: 'Grip Management',
      description: 'Manage grip inventory, add new grips, update stock',
      path: '/seller/grips',
      icon: '🎾'
    },
    {
      title: 'Shuttlecock Management',
      description: 'Manage shuttlecock inventory, add new shuttlecocks, update stock',
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
              <CardDescription>{section.description}</CardDescription>
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