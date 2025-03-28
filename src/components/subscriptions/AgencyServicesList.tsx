
import React from 'react';
import { ServiceType, ServiceTypeLabels } from '@/types/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Contenu statique des services avec leur description
const AGENCY_SERVICES = [
  {
    type: ServiceType.DIGITAL_STRATEGY,
    description: 'Élaboration d\'un plan stratégique personnalisé visant à atteindre les objectifs commerciaux en ligne de l\'entreprise. Cela inclut l\'analyse du marché, l\'identification du public cible, la sélection des canaux de communication appropriés et la définition des indicateurs de performance clés (KPI).'
  },
  {
    type: ServiceType.SEO,
    description: 'Amélioration de la visibilité du site web sur les moteurs de recherche grâce à l\'optimisation des contenus, des balises méta, de la structure du site et à la création de backlinks de qualité.'
  },
  {
    type: ServiceType.SEA,
    description: 'Gestion de campagnes publicitaires payantes sur des plateformes telles que Google Ads ou Facebook Ads, incluant la création d\'annonces, le ciblage de l\'audience, le suivi des performances et l\'optimisation des budgets.'
  },
  {
    type: ServiceType.CONTENT_MARKETING,
    description: 'Création et diffusion de contenus pertinents et engageants, tels que des articles de blog, des vidéos, des infographies, visant à attirer et fidéliser l\'audience cible.'
  },
  {
    type: ServiceType.SOCIAL_MEDIA,
    description: 'Développement et mise en œuvre de stratégies sur les plateformes sociales, incluant la création de contenu, la gestion des publications, l\'interaction avec la communauté et l\'analyse des performances.'
  },
  {
    type: ServiceType.WEB_DEVELOPMENT,
    description: 'Conception et développement de sites web sur mesure, optimisés pour une expérience utilisateur fluide et adaptés aux différents appareils.'
  },
  {
    type: ServiceType.ECOMMERCE,
    description: 'Création et gestion de boutiques en ligne, incluant l\'intégration de systèmes de paiement sécurisés, la gestion des stocks, l\'optimisation de l\'expérience utilisateur et la mise en place de stratégies de conversion.'
  },
  {
    type: ServiceType.DATA_ANALYSIS,
    description: 'Collecte, analyse et interprétation des données relatives aux performances des campagnes marketing, fournissant des rapports détaillés et des recommandations pour optimiser les stratégies en cours.'
  },
  {
    type: ServiceType.MARKETING_AUTOMATION,
    description: 'Mise en place de systèmes automatisés pour gérer des tâches marketing répétitives, telles que l\'envoi d\'e-mails, le suivi des leads et la segmentation de l\'audience, améliorant ainsi l\'efficacité et la personnalisation des campagnes.'
  },
  {
    type: ServiceType.INFLUENCE_MARKETING,
    description: 'Collaboration avec des influenceurs pertinents pour promouvoir des produits ou services auprès de leur audience, incluant la sélection des influenceurs, la négociation des contrats et le suivi des performances.'
  },
  {
    type: ServiceType.UX_DESIGN,
    description: 'Amélioration de la conception et de la fonctionnalité des interfaces utilisateur pour augmenter la satisfaction, l\'engagement et la conversion des visiteurs en clients.'
  },
  {
    type: ServiceType.VOICE_MARKETING,
    description: 'Création et diffusion de contenus audio, tels que des podcasts ou des messages pour assistants vocaux, visant à atteindre l\'audience via des canaux émergents et à renforcer la présence de la marque.'
  },
  {
    type: ServiceType.ONLINE_REPUTATION,
    description: 'Surveillance et amélioration de l\'image de marque sur Internet en gérant les avis clients, en répondant aux commentaires négatifs et en mettant en avant les retours positifs. Cela inclut également la création de contenu positif pour renforcer la présence en ligne.'
  },
  {
    type: ServiceType.EMAIL_MARKETING,
    description: 'Conception et envoi de campagnes d\'e-mails ciblées pour informer les clients des nouveautés, promotions ou actualités de l\'entreprise. Cela comprend la segmentation de la liste de contacts, la création de contenus engageants et l\'analyse des performances des campagnes.'
  },
  {
    type: ServiceType.FORMATION,
    description: 'Offre de sessions de formation personnalisées pour les équipes internes afin de renforcer leurs compétences en marketing digital. Cela peut couvrir des sujets tels que le SEO, la gestion des réseaux sociaux, la publicité en ligne, l\'analyse de données, etc.'
  },
  {
    type: ServiceType.DIGITAL_TRANSFORMATION,
    description: 'Accompagnement des entreprises dans l\'intégration de technologies numériques pour optimiser leurs opérations et modèles commerciaux.'
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
