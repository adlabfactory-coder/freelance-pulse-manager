
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { initializeTestUsers } from '@/utils/user-creation-helper';

interface TestConnectionButtonProps {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
}

const TestConnectionButton: React.FC<TestConnectionButtonProps> = ({ variant = 'outline' }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await initializeTestUsers();
      
      if (result.success) {
        toast({
          title: "Création d'utilisateurs réussie",
          description: `${result.successCount} utilisateurs ont été créés avec succès.`,
        });
      } else {
        toast({
          title: "Création d'utilisateurs partiellement réussie",
          description: `${result.successCount} utilisateurs créés, ${result.errorCount} erreurs rencontrées.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des utilisateurs de test:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer les utilisateurs de test. Consultez la console pour plus de détails.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleClick} 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Création en cours...
        </>
      ) : (
        "Initialiser les utilisateurs de test"
      )}
    </Button>
  );
};

export default TestConnectionButton;
