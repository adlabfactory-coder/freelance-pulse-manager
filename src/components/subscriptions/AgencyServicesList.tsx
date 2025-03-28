
import React from 'react';
import { ServiceType, ServiceTypeLabels } from '@/types/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Contenu statique des services avec leur description
const AGENCY_SERVICES = [
  {
    type: ServiceType.CONTENT_MARKETING,
    description: 'Création et diffusion de contenus pertinents (articles, vidéos, infographies) pour attirer et engager l\'audience cible.'
  },
  {
    type: ServiceType.SOCIAL_MEDIA,
    description: 'Développement et mise en œuvre de stratégies sur les plateformes sociales pour renforcer la présence de la marque et interagir avec la communauté.'
  },
  {
    type: ServiceType.WEB_DEVELOPMENT,
    description: 'Conception de sites web et d\'applications mobiles optimisés pour une expérience utilisateur fluide et efficace.'
  },
  {
    type: ServiceType.ECOMMERCE,
    description: 'Création et gestion de boutiques en ligne, y compris l\'intégration de systèmes de paiement sécurisés et la gestion des stocks.'
  },
  {
    type: ServiceType.DATA_ANALYSIS,
    description: 'Collecte et interprétation de données pour évaluer la performance des campagnes et informer les décisions stratégiques.'
  },
  {
    type: ServiceType.MARKETING_AUTOMATION,
    description: 'Mise en place de systèmes automatisés pour des tâches répétitives, améliorant l\'efficacité et la personnalisation des interactions clients.'
  },
  {
    type: ServiceType.INFLUENCE_MARKETING,
    description: 'Collaboration avec des influenceurs pour promouvoir des produits ou services auprès de leurs audiences engagées.'
  },
  {
    type: ServiceType.UX_DESIGN,
    description: 'Amélioration de la conception et de la fonctionnalité des interfaces pour augmenter la satisfaction et la fidélisation des clients.'
  },
  {
    type: ServiceType.VOICE_MARKETING,
    description: 'Utilisation de contenus audio pour atteindre les audiences via des assistants vocaux et des podcasts, offrant une nouvelle dimension à la communication de marque.'
  },
  {
    type: ServiceType.ONLINE_REPUTATION,
    description: 'Surveillance et amélioration de l\'image de marque sur Internet, y compris la gestion des avis et des relations publiques numériques.'
  },
  {
    type: ServiceType.DIGITAL_TRANSFORMATION,
    description: 'Accompagnement des entreprises dans l\'intégration de technologies numériques pour optimiser leurs opérations et modèles commerciaux.'
  },
  {
    type: ServiceType.TRAINING,
    description: 'Offre de sessions éducatives pour former les équipes internes aux meilleures pratiques du marketing digital et aux outils technologiques actuels.'
  }
];

export interface AgencyServicesListProps {
  className?: string;
}

const AgencyServicesList: React.FC<AgencyServicesListProps> = ({ className = '' }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Services de l'agence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {AGENCY_SERVICES.map((service, index) => (
          <div key={service.type} className={index > 0 ? 'pt-4' : ''}>
            {index > 0 && <Separator className="mb-4" />}
            <h3 className="text-lg font-semibold">{ServiceTypeLabels[service.type]}</h3>
            <p className="text-muted-foreground mt-1">{service.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AgencyServicesList;
