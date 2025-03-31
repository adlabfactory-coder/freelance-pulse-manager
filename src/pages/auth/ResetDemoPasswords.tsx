
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { demoUsers } from '@/utils/user-list';
import { Link } from 'react-router-dom';

const ResetDemoPasswords: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleResetPasswords = async () => {
    setIsResetting(true);
    setResults([]);
    const newResults: string[] = [];

    try {
      // Réinitialiser les mots de passe pour les utilisateurs de démo uniquement
      for (const user of demoUsers) {
        try {
          // Vérifier si l'utilisateur existe dans auth.users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (userError) {
            newResults.push(`❌ Erreur pour ${user.email}: ${userError.message}`);
            continue;
          }

          // Mettre à jour le mot de passe dans la table users
          const { error: updateError } = await supabase
            .from('users')
            .update({ password: '123456' })
            .eq('email', user.email);

          if (updateError) {
            newResults.push(`⚠️ Erreur de mise à jour du mot de passe pour ${user.email}: ${updateError.message}`);
          } else {
            newResults.push(`✅ Mot de passe réinitialisé pour ${user.email}`);
          }

          // Si l'utilisateur existe dans auth.users, mettre également à jour son mot de passe
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userData.id);
          
          if (!authError && authUser) {
            const { error: resetError } = await supabase.auth.admin.updateUserById(
              userData.id,
              { password: '123456' }
            );
            
            if (resetError) {
              newResults.push(`⚠️ Erreur de réinitialisation du mot de passe Supabase pour ${user.email}: ${resetError.message}`);
            } else {
              newResults.push(`✅ Mot de passe Supabase réinitialisé pour ${user.email}`);
            }
          }
        } catch (error: any) {
          newResults.push(`❌ Erreur pour ${user.email}: ${error.message}`);
        }
      }

      setResults(newResults);
      toast.success('Réinitialisation des mots de passe terminée');
    } catch (error: any) {
      toast.error(`Une erreur s'est produite: ${error.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Réinitialiser les mots de passe de démo</CardTitle>
          <CardDescription>
            Réinitialisez les mots de passe de tous les utilisateurs de démonstration à "123456"
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Cette action réinitialisera les mots de passe des utilisateurs de démonstration uniquement (admin@example.com, super@example.com, freelance@example.com, commercial@example.com).
          </p>
          
          {results.length > 0 && (
            <div className="mt-4 border rounded-md p-4 bg-muted/50">
              <h3 className="font-medium mb-2">Résultats:</h3>
              <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
                {results.map((result, i) => (
                  <div key={i} className="font-mono text-xs">{result}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/auth/login">Retour</Link>
          </Button>
          <Button 
            onClick={handleResetPasswords}
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Réinitialisation en cours...
              </>
            ) : (
              'Réinitialiser les mots de passe'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetDemoPasswords;
