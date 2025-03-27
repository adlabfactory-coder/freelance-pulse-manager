
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { UserForm } from '@/components/settings/UserForm';
import { User } from '@/types';
import { UserRole } from '@/types/roles';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, ChevronRight } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  role: UserRole;
  description: string;
}

const UserProfileTemplates = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showForm, setShowForm] = useState(false);

  const templates: Template[] = [
    {
      id: '1',
      name: 'Chargé de compte standard',
      role: UserRole.ACCOUNT_MANAGER,
      description: 'Utilisateur responsable du suivi clients et de la génération des devis'
    },
    {
      id: '2',
      name: 'Freelancer commercial',
      role: UserRole.FREELANCER,
      description: 'Commercial indépendant gérant ses propres contacts et obtenant des commissions'
    },
    {
      id: '3',
      name: 'Administrateur',
      role: UserRole.ADMIN,
      description: 'Accès complet à la gestion des utilisateurs et des données'
    }
  ];

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleSuccess = (newUser: User) => {
    toast({
      title: "Utilisateur créé",
      description: `${newUser.name} a été ajouté avec succès en tant que ${USER_ROLE_LABELS[newUser.role as UserRole]}.`,
    });
    setShowForm(false);
    setSelectedTemplate(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTemplate(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ajout d'utilisateur</CardTitle>
        <CardDescription>
          Sélectionnez un modèle de profil pour ajouter rapidement un nouvel utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {template.name}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium">Création d'un {selectedTemplate?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedTemplate?.description}</p>
            </div>
            <UserForm 
              defaultRole={selectedTemplate?.role}
              onSuccess={handleSuccess} 
              onCancel={handleCancel} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Administrateur",
  [UserRole.ADMIN]: "Administrateur",
  [UserRole.ACCOUNT_MANAGER]: "Chargé de compte",
  [UserRole.FREELANCER]: "Freelancer"
};

export default UserProfileTemplates;
