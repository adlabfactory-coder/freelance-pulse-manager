import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';
import { useSupabase } from '@/hooks/use-supabase';

interface UserFormProps {
  user?: User;
  onSuccess?: (user: User) => void;
  onCancel?: () => void;
  defaultRole?: UserRole;
}

interface UserCreateInput extends Omit<User, "id"> {
  password?: string;
  schedule_enabled?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSuccess,
  onCancel,
  defaultRole = UserRole.FREELANCER,
}) => {
  const supabase = useSupabase();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [generatePassword, setGeneratePassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || defaultRole);
    } else {
      setName('');
      setEmail('');
      setRole(defaultRole);
      setPassword('');
      setPasswordConfirm('');
      setGeneratePassword(false);
    }
  }, [user, defaultRole]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const passwordLength = 12;
    let randomPassword = '';
    
    for (let i = 0; i < passwordLength; i++) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      randomPassword += randomChar;
    }
    
    setPassword(randomPassword);
    setPasswordConfirm(randomPassword);
    setGeneratePassword(true);
    
    return randomPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        toast("Le nom est requis.");
        setIsSubmitting(false);
        return;
      }

      if (!email.trim() || !email.includes('@')) {
        toast("Email invalide.");
        setIsSubmitting(false);
        return;
      }

      if (!user && !generatePassword && password !== passwordConfirm) {
        toast("Les mots de passe ne correspondent pas.");
        setIsSubmitting(false);
        return;
      }

      let finalPassword = password;
      if (!user && generatePassword) {
        finalPassword = generateRandomPassword();
      }

      let result;
      
      if (user?.id) {
        result = await supabase.updateUser({
          id: user.id,
          name,
          email,
          role,
          schedule_enabled: false
        });
        
        if (result) {
          toast.success(`L'utilisateur ${name} a été mis à jour avec succès.`);
          
          if (onSuccess) {
            onSuccess({
              id: user.id,
              name,
              email,
              role,
              avatar: user.avatar
            });
          }
        } else {
          toast.error(`Impossible de mettre à jour l'utilisateur.`);
        }
      } else {
        const userInput: UserCreateInput = {
          name,
          email,
          role,
          avatar: null,
          schedule_enabled: false,
          password: finalPassword
        };
        
        result = await supabase.createUser(userInput);
        
        if (result && result.success) {
          toast.success(`L'utilisateur ${name} a été créé avec succès.`);
          
          if (generatePassword) {
            toast.info(`Mot de passe généré: ${finalPassword}`, {
              duration: 10000,
            });
          }
          
          if (onSuccess && result.id) {
            onSuccess({
              id: result.id,
              name,
              email,
              role,
              avatar: null
            });
          }
        } else {
          toast.error(`Impossible de créer l'utilisateur.`);
        }
      }
    } catch (error) {
      console.error(`Erreur lors de ${user ? "la mise à jour" : "la création"} de l'utilisateur:`, error);
      toast.error(`Une erreur est survenue lors de ${user ? "la mise à jour" : "la création"} de l'utilisateur.`);
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
          
          {!user && (
            <>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generate-password"
                    checked={generatePassword}
                    onChange={() => {
                      if (!generatePassword) {
                        generateRandomPassword();
                      } else {
                        setPassword('');
                        setPasswordConfirm('');
                        setGeneratePassword(false);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="generate-password" className="text-sm font-normal">
                    Générer un mot de passe aléatoire
                  </Label>
                </div>
              </div>
              
              {!generatePassword ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required={!user}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Confirmer le mot de passe</Label>
                    <Input
                      id="password-confirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      required={!user}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="generated-password">Mot de passe généré</Label>
                  <div className="flex">
                    <Input
                      id="generated-password"
                      type="text"
                      value={password}
                      readOnly
                      className="mr-2 flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(password);
                        toast.success("Mot de passe copié dans le presse-papier");
                      }}
                    >
                      Copier
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ce mot de passe sera affiché une seule fois après la création du compte.
                  </p>
                </div>
              )}
            </>
          )}
          
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
