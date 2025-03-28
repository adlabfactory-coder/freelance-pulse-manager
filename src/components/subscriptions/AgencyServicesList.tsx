
import React, { useState } from 'react';
import { ServiceType, ServiceTypeLabels } from '@/types/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Contenu des services de l'agence avec leur description et estimation de tarif
const AGENCY_SERVICES = [
  {
    type: ServiceType.DIGITAL_STRATEGY,
    description: 'Élaboration d\'un plan stratégique personnalisé visant à atteindre les objectifs commerciaux en ligne de l\'entreprise. Cela inclut l\'analyse du marché, l\'identification du public cible, la sélection des canaux de communication appropriés et la définition des indicateurs de performance clés (KPI).',
    priceRange: 'Entre 5 000 et 50 000 MAD par mois, selon l\'ampleur de la stratégie et les services inclus.'
  },
  {
    type: ServiceType.SEO,
    description: 'Amélioration de la visibilité du site web sur les moteurs de recherche grâce à l\'optimisation des contenus, des balises méta, de la structure du site et à la création de backlinks de qualité.',
    priceRange: 'À partir de 2 500 MAD par mois, en fonction de la complexité des mots-clés ciblés.'
  },
  {
    type: ServiceType.SEA,
    description: 'Gestion de campagnes publicitaires payantes sur des plateformes telles que Google Ads ou Facebook Ads, incluant la création d\'annonces, le ciblage de l\'audience, le suivi des performances et l\'optimisation des budgets.',
    priceRange: 'Budget de départ à partir de 1 500 MAD par mois, selon la taille de l\'entreprise et le volume de contenu.'
  },
  {
    type: ServiceType.CONTENT_MARKETING,
    description: 'Création et diffusion de contenus pertinents et engageants, tels que des articles de blog, des vidéos, des infographies, visant à attirer et fidéliser l\'audience cible.',
    priceRange: 'Entre 500 et 2 000 MAD par campagne, selon la qualité des services et de la base de données utilisée.'
  },
  {
    type: ServiceType.SOCIAL_MEDIA,
    description: 'Développement et mise en œuvre de stratégies sur les plateformes sociales, incluant la création de contenu, la gestion des publications, l\'interaction avec la communauté et l\'analyse des performances.',
    priceRange: 'À partir de 1 500 MAD par mois, selon la taille de l\'entreprise et le volume de contenu.'
  },
  {
    type: ServiceType.WEB_DEVELOPMENT,
    description: 'Conception et développement de sites web sur mesure, optimisés pour une expérience utilisateur fluide et adaptés aux différents appareils.',
    priceRange: 'Pour un site vitrine professionnel, les prix commencent à partir de 6 000 MAD. Pour un site e-commerce, les coûts peuvent aller de 15 000 à 60 000 MAD, en fonction des fonctionnalités requises.'
  },
  {
    type: ServiceType.ECOMMERCE,
    description: 'Création et gestion de boutiques en ligne, incluant l\'intégration de systèmes de paiement sécurisés, la gestion des stocks, l\'optimisation de l\'expérience utilisateur et la mise en place de stratégies de conversion.',
    priceRange: 'Entre 10 000 et 50 000 MAD, selon les fonctionnalités requises et la taille du catalogue de produits.'
  },
  {
    type: ServiceType.DATA_ANALYSIS,
    description: 'Collecte, analyse et interprétation des données relatives aux performances des campagnes marketing, fournissant des rapports détaillés et des recommandations pour optimiser les stratégies en cours.',
    priceRange: 'Les coûts varient en fonction de la complexité des analyses et de la fréquence des rapports.'
  },
  {
    type: ServiceType.MARKETING_AUTOMATION,
    description: 'Mise en place de systèmes automatisés pour gérer des tâches marketing répétitives, telles que l\'envoi d\'e-mails, le suivi des leads et la segmentation de l\'audience, améliorant ainsi l\'efficacité et la personnalisation des campagnes.',
    priceRange: 'Les coûts varient en fonction des outils utilisés et de la complexité des automatisations mises en place.'
  },
  {
    type: ServiceType.INFLUENCE_MARKETING,
    description: 'Collaboration avec des influenceurs pertinents pour promouvoir des produits ou services auprès de leur audience, incluant la sélection des influenceurs, la négociation des contrats et le suivi des performances.',
    priceRange: 'Les coûts varient en fonction de la notoriété de l\'influenceur et de la portée de la campagne.'
  },
  {
    type: ServiceType.UX_DESIGN,
    description: 'Amélioration de la conception et de la fonctionnalité des interfaces utilisateur pour augmenter la satisfaction, l\'engagement et la conversion des visiteurs en clients.',
    priceRange: 'Les coûts varient en fonction de l\'ampleur des modifications et de la complexité du site ou de l\'application.'
  },
  {
    type: ServiceType.VOICE_MARKETING,
    description: 'Création et diffusion de contenus audio, tels que des podcasts ou des messages pour assistants vocaux, visant à atteindre l\'audience via des canaux émergents et à renforcer la présence de la marque.',
    priceRange: 'Les coûts varient en fonction de la durée et de la complexité de la production.'
  },
  {
    type: ServiceType.ONLINE_REPUTATION,
    description: 'Surveillance et amélioration de l\'image de marque sur Internet en gérant les avis clients, en répondant aux commentaires négatifs et en mettant en avant les retours positifs. Cela inclut également la création de contenu positif pour renforcer la présence en ligne.',
    priceRange: 'Les coûts varient en fonction de l\'ampleur des services requis et de la taille de l\'entreprise.'
  },
  {
    type: ServiceType.EMAIL_MARKETING,
    description: 'Conception et envoi de campagnes d\'e-mails ciblées pour informer les clients des nouveautés, promotions ou actualités de l\'entreprise. Cela comprend la segmentation de la liste de contacts, la création de contenus engageants et l\'analyse des performances des campagnes.',
    priceRange: 'Entre 500 et 2 000 MAD par campagne, selon la qualité des services et de la base de données utilisée.'
  },
  {
    type: ServiceType.FORMATION,
    description: 'Offre de sessions de formation personnalisées pour les équipes internes afin de renforcer leurs compétences en marketing digital. Cela peut couvrir des sujets tels que le SEO, la gestion des réseaux sociaux, la publicité en ligne, l\'analyse de données, etc.',
    priceRange: 'Les coûts varient en fonction de la durée de la formation et des sujets abordés.'
  },
  {
    type: ServiceType.DIGITAL_TRANSFORMATION,
    description: 'Accompagnement des entreprises dans l\'intégration de technologies numériques pour optimiser leurs opérations et modèles commerciaux.',
    priceRange: 'Les coûts varient selon l\'ampleur du projet et la taille de l\'entreprise.'
  }
];

export interface AgencyServicesListProps {
  className?: string;
}

const AgencyServicesList: React.FC<AgencyServicesListProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = AGENCY_SERVICES.filter(service => 
    ServiceTypeLabels[service.type].toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Services de l'agence</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredServices.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            Aucun service ne correspond à votre recherche.
          </div>
        ) : (
          filteredServices.map((service, index) => (
            <div key={service.type} className={index > 0 ? 'pt-4' : ''}>
              {index > 0 && <Separator className="mb-4" />}
              <h3 className="text-lg font-semibold">{ServiceTypeLabels[service.type]}</h3>
              <p className="text-muted-foreground mt-1">{service.description}</p>
              <p className="text-sm font-medium mt-2">Tarif estimé: <span className="text-primary">{service.priceRange}</span></p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AgencyServicesList;
