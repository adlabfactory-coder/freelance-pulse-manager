
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const SupportButton: React.FC = () => {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/+212663529031', '_blank');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleWhatsAppContact}
      aria-label="Contacter par WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
    </Button>
  );
};

export default SupportButton;
