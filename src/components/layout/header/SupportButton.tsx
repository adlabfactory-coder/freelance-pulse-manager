
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { formatUrl } from '@/utils/url-utils';

const SupportButton: React.FC = () => {
  const handleWhatsAppContact = () => {
    // Utilisation d'une URL WhatsApp correctement formatée
    const whatsappUrl = formatUrl('https://wa.me/+212663529031');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
