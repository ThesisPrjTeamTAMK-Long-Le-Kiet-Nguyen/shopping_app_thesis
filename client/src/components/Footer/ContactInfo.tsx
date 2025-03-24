import { Mail, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="w-full py-4 bg-muted/50 border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">Contacts:</span>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:contact@badmintonstore.com" className="hover:text-primary">
              contact@badmintonstore.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href="tel:+1234567890" className="hover:text-primary">
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo; 