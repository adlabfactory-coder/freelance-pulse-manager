
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { UserRole } from '@/types/roles';
import { useUserOperations } from '@/hooks/supabase/use-user-operations';
import { toast } from 'sonner';
import UserStatusBadge from '../settings/users/UserStatusBadge';

// Define the schema using strings for role values to match the SelectItem values
const userSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }),
  role: z.enum(['user', 'freelancer', 'account_manager', 'admin', 'super_admin']),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal(''))
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

interface UserEditFormProps {
  user: User;
  onUpdate: (user: User) => Promise<void>;
  onCancel: () => void;
  isCurrentUser: boolean;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user, onUpdate, onCancel, isCurrentUser }) => {
  const { updateUserProfile } = useUserOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline] = useState(Math.random() > 0.5); // Simulation pour la démonstration

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    try {
      // Vérifier si l'utilisateur a saisi un nouveau mot de passe
      const updateData: Partial<User> = {
        id: user.id,
        name: values.name,
        email: values.email,
        role: values.role as UserRole,
      };

      // Ajouter le mot de passe uniquement s'il est fourni
      if (values.password && values.password.length > 0) {
        updateData.password = values.password;
      }

      // Simuler la mise à jour de l'utilisateur dans la base de données
      const updatedUser = await updateUserProfile(updateData);
      
      if (updatedUser) {
        toast.success('Utilisateur mis à jour avec succès');
        await onUpdate({
          ...user,
          name: values.name,
          email: values.email,
          role: values.role as UserRole,
        });
      } else {
        toast.error('Erreur lors de la mise à jour de l\'utilisateur');
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Modifier l'utilisateur</CardTitle>
        <UserStatusBadge isOnline={isOnline} />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isCurrentUser || user.role === 'super_admin'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role === 'super_admin' ? 'Super Administrateur' : 
                           role === 'admin' ? 'Administrateur' : 
                           role === 'account_manager' ? 'Chargé de compte' : 'Freelance'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe (facultatif)</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default UserEditForm;
