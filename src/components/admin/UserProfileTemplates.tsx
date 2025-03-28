
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/roles";

interface DescriptionProps {
  title: string;
  description: string;
  permissions: string[];
}

// Import from types directly to avoid conflict
import { USER_ROLE_LABELS as RoleLabels } from "@/types/roles";

interface UserTemplateCardProps {
  role: UserRole;
  title: string;
  description: string;
  onClick: () => void;
}

const UserTemplateCard: React.FC<UserTemplateCardProps> = ({
  role,
  title,
  description,
  onClick,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {ROLE_DESCRIPTIONS[role]}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="default"
          onClick={onClick}
          className="w-full"
        >
          Sélectionner
        </Button>
      </CardFooter>
    </Card>
  );
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]:
    "Accès complet à toutes les fonctionnalités du système, y compris la configuration, les rapports financiers et les paramètres administratifs.",
  [UserRole.ADMIN]:
    "Gestion des utilisateurs, accès aux rapports et statistiques, configuration des paramètres généraux.",
  [UserRole.ACCOUNT_MANAGER]:
    "Gestion des contacts et des devis, accès aux rapports de leur activité, suivi des abonnements.",
  [UserRole.FREELANCER]:
    "Gestion des contacts assignés, création de devis, suivi de commissions."
};

export const getUserDescriptionByRole = (role: UserRole): DescriptionProps => {
  const descriptions: Record<UserRole, DescriptionProps> = {
    [UserRole.SUPER_ADMIN]: {
      title: "Super Administrateur",
      description: "Accès complet et illimité à la plateforme",
      permissions: [
        "Gestion complète des utilisateurs",
        "Configuration du système",
        "Rapports financiers détaillés",
        "Audit et sécurité",
        "Paramètres administratifs avancés",
        "Gestion des rôles et permissions",
      ],
    },
    [UserRole.ADMIN]: {
      title: "Administrateur",
      description: "Gestion administrative de la plateforme",
      permissions: [
        "Gestion des utilisateurs",
        "Rapports et statistiques",
        "Paramètres généraux",
        "Distribution des contacts",
        "Gestion des abonnements",
      ],
    },
    [UserRole.ACCOUNT_MANAGER]: {
      title: "Chargé de compte",
      description: "Gestion commerciale et suivi client",
      permissions: [
        "Gestion des contacts",
        "Création et suivi de devis",
        "Rapports d'activité",
        "Suivi des abonnements clients",
        "Gestion du calendrier",
      ],
    },
    [UserRole.FREELANCER]: {
      title: "Freelance",
      description: "Gestion commerciale et prospection",
      permissions: [
        "Gestion des contacts assignés",
        "Création de devis",
        "Suivi de commissions",
        "Calendrier des rendez-vous",
      ],
    }
  };

  return descriptions[role];
};

const ROLE_DESC_TEMPLATES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Accès complet à toutes les fonctionnalités",
  [UserRole.ADMIN]: "Gestion administrative et supervision",
  [UserRole.ACCOUNT_MANAGER]: "Suivi clients et gestion commerciale",
  [UserRole.FREELANCER]: "Prospection et développement commercial"
};

export const UserProfileTemplates: React.FC<{
  onSelectTemplate: (role: UserRole) => void;
}> = ({ onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      <UserTemplateCard
        role={UserRole.FREELANCER}
        title="Freelance"
        description="Profil pour les commerciaux indépendants"
        onClick={() => onSelectTemplate(UserRole.FREELANCER)}
      />
      <UserTemplateCard
        role={UserRole.ACCOUNT_MANAGER}
        title="Chargé de compte"
        description="Profil pour les gestionnaires de comptes"
        onClick={() => onSelectTemplate(UserRole.ACCOUNT_MANAGER)}
      />
      <UserTemplateCard
        role={UserRole.ADMIN}
        title="Administrateur"
        description="Profil pour les administrateurs de plateforme"
        onClick={() => onSelectTemplate(UserRole.ADMIN)}
      />
      <UserTemplateCard
        role={UserRole.SUPER_ADMIN}
        title="Super Administrateur"
        description="Profil avec accès complet"
        onClick={() => onSelectTemplate(UserRole.SUPER_ADMIN)}
      />
    </div>
  );
};

export default UserProfileTemplates;
