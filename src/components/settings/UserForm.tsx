
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types';
import { useSupabase } from '@/hooks/use-supabase';

interface UserFormProps {
  user?: User;
  onSuccess?: (user: User) => void;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const supabase = useSupabase();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.FREELANCER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || UserRole.FREELANCER);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation de base
      if (!name.trim()) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le nom est requis.",
        });
        return;
      }

      if (!email.trim() || !email.includes('@')) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Email invalide.",
        });
        return;
      }

      // Update existing user or create new one
      let result;
      
      if (user?.id) {
        // Update existing user
        result = await supabase.updateUser({
          id: user.id,
          name,
          email,
          role,
          schedule_enabled: false // Remplacé calendly_enabled par schedule_enabled
        });
      } else {
        // Create new user
        result = await supabase.createUser({
          name,
          email,
          role,
          avatar: null,
          schedule_enabled: false // Remplacé calendly_enabled par schedule_enabled
        });
      }

      if (result) {
        toast({
          title: user ? "Utilisateur mis à jour" : "Utilisateur créé",
          description: `L'utilisateur a été ${user ? "mis à jour" : "créé"} avec succès.`,
        });
        
        if (onSuccess && result.id) {
          onSuccess({
            id: result.id,
            name,
            email,
            role,
            avatar: null,
            schedule_enabled: false // Remplacé calendly_enabled par schedule_enabled
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de ${user ? "mettre à jour" : "créer"} l'utilisateur.`,
        });
      }
    } catch (error) {
      console.error(`Erreur lors de ${user ? "la mise à jour" : "la création"} de l'utilisateur:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Une erreur est survenue lors de ${user ? "la mise à jour" : "la création"} de l'utilisateur.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom complet"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.ADMIN} id="role-admin" />
                <Label htmlFor="role-admin">Administrateur</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.SUPER_ADMIN} id="role-super-admin" />
                <Label htmlFor="role-super-admin">Super Administrateur</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.FREELANCER} id="role-freelancer" />
                <Label htmlFor="role-freelancer">Freelance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.ACCOUNT_MANAGER} id="role-account-manager" />
                <Label htmlFor="role-account-manager">Gestionnaire de compte</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserRole.CLIENT} id="role-client" />
                <Label htmlFor="role-client">Client</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : user ? 'Mettre à jour' : 'Créer'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;
