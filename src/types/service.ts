
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: ServiceType;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum ServiceType {
  DIGITAL_STRATEGY = 'digital_strategy',
  SEO = 'seo',
  SEA = 'sea',
  CONTENT_MARKETING = 'content_marketing',
  SOCIAL_MEDIA = 'social_media',
  WEB_DEVELOPMENT = 'web_development',
  ECOMMERCE = 'ecommerce',
  DATA_ANALYSIS = 'data_analysis',
  MARKETING_AUTOMATION = 'marketing_automation',
  INFLUENCE_MARKETING = 'influence_marketing',
  UX_DESIGN = 'ux_design',
  VOICE_MARKETING = 'voice_marketing',
  ONLINE_REPUTATION = 'online_reputation',
  EMAIL_MARKETING = 'email_marketing',
  FORMATION = 'formation',
  DIGITAL_TRANSFORMATION = 'digital_transformation',
  TRAINING = 'training',
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
  CONSULTING = 'consulting',
  OTHER = 'other'
}

export const ServiceTypeLabels: Record<ServiceType, string> = {
  [ServiceType.DIGITAL_STRATEGY]: 'Stratégie de marketing digital',
  [ServiceType.SEO]: 'Optimisation pour les moteurs de recherche (SEO)',
  [ServiceType.SEA]: 'Publicité en ligne (SEA)',
  [ServiceType.CONTENT_MARKETING]: 'Marketing de contenu',
  [ServiceType.SOCIAL_MEDIA]: 'Gestion des réseaux sociaux',
  [ServiceType.WEB_DEVELOPMENT]: 'Développement web et mobile',
  [ServiceType.ECOMMERCE]: 'Commerce électronique',
  [ServiceType.DATA_ANALYSIS]: 'Analyse de données et reporting',
  [ServiceType.MARKETING_AUTOMATION]: 'Automatisation du marketing',
  [ServiceType.INFLUENCE_MARKETING]: 'Marketing d\'influence',
  [ServiceType.UX_DESIGN]: 'Optimisation de l\'expérience utilisateur (UX/UI)',
  [ServiceType.VOICE_MARKETING]: 'Marketing vocal et podcasting',
  [ServiceType.ONLINE_REPUTATION]: 'Gestion de la réputation en ligne',
  [ServiceType.EMAIL_MARKETING]: 'Marketing par e-mail (Emailing)',
  [ServiceType.FORMATION]: 'Formation et consultation en marketing digital',
  [ServiceType.DIGITAL_TRANSFORMATION]: 'Consultation en transformation numérique',
  [ServiceType.TRAINING]: 'Formation et ateliers',
  [ServiceType.SUBSCRIPTION]: 'Abonnement',
  [ServiceType.ONE_TIME]: 'Service ponctuel',
  [ServiceType.RECURRING]: 'Service récurrent',
  [ServiceType.CONSULTING]: 'Consultation',
  [ServiceType.OTHER]: 'Autre'
};

// Constante pour les services par défaut avec prix estimés
export const DEFAULT_SERVICES = [
  {
    type: ServiceType.DIGITAL_STRATEGY,
    name: 'Stratégie de marketing digital',
    description: 'Élaboration d\'un plan stratégique personnalisé visant à atteindre les objectifs commerciaux en ligne de l\'entreprise. Cela inclut l\'analyse du marché, l\'identification du public cible, la sélection des canaux de communication appropriés et la définition des indicateurs de performance clés (KPI).',
    price: 25000,  // Prix moyen entre 5000 et 50000 MAD
    is_active: true
  },
  {
    type: ServiceType.SEO,
    name: 'Optimisation pour les moteurs de recherche (SEO)',
    description: 'Amélioration de la visibilité du site web sur les moteurs de recherche grâce à l\'optimisation des contenus, des balises méta, de la structure du site et à la création de backlinks de qualité.',
    price: 2500,  // Prix de base à partir de 2500 MAD
    is_active: true
  },
  {
    type: ServiceType.SEA,
    name: 'Publicité en ligne (SEA)',
    description: 'Gestion de campagnes publicitaires payantes sur des plateformes telles que Google Ads ou Facebook Ads, incluant la création d\'annonces, le ciblage de l\'audience, le suivi des performances et l\'optimisation des budgets.',
    price: 1500,  // Prix de base à partir de 1500 MAD
    is_active: true
  },
  {
    type: ServiceType.CONTENT_MARKETING,
    name: 'Marketing de contenu',
    description: 'Création et diffusion de contenus pertinents et engageants, tels que des articles de blog, des vidéos, des infographies, visant à attirer et fidéliser l\'audience cible.',
    price: 1250,  // Prix moyen entre 500 et 2000 MAD
    is_active: true
  },
  {
    type: ServiceType.SOCIAL_MEDIA,
    name: 'Gestion des réseaux sociaux',
    description: 'Développement et mise en œuvre de stratégies sur les plateformes sociales, incluant la création de contenu, la gestion des publications, l\'interaction avec la communauté et l\'analyse des performances.',
    price: 1500,  // Prix de base à partir de 1500 MAD
    is_active: true
  },
  {
    type: ServiceType.WEB_DEVELOPMENT,
    name: 'Développement web et mobile',
    description: 'Conception et développement de sites web sur mesure, optimisés pour une expérience utilisateur fluide et adaptés aux différents appareils.',
    price: 6000,  // Prix de base à partir de 6000 MAD
    is_active: true
  },
  {
    type: ServiceType.ECOMMERCE,
    name: 'Commerce électronique (e-commerce)',
    description: 'Création et gestion de boutiques en ligne, incluant l\'intégration de systèmes de paiement sécurisés, la gestion des stocks, l\'optimisation de l\'expérience utilisateur et la mise en place de stratégies de conversion.',
    price: 30000,  // Prix moyen entre 10000 et 50000 MAD
    is_active: true
  },
  {
    type: ServiceType.DATA_ANALYSIS,
    name: 'Analyse de données et reporting',
    description: 'Collecte, analyse et interprétation des données relatives aux performances des campagnes marketing, fournissant des rapports détaillés et des recommandations pour optimiser les stratégies en cours.',
    price: 3000,
    is_active: true
  },
  {
    type: ServiceType.MARKETING_AUTOMATION,
    name: 'Automatisation du marketing',
    description: 'Mise en place de systèmes automatisés pour gérer des tâches marketing répétitives, telles que l\'envoi d\'e-mails, le suivi des leads et la segmentation de l\'audience, améliorant ainsi l\'efficacité et la personnalisation des campagnes.',
    price: 4000,
    is_active: true
  },
  {
    type: ServiceType.INFLUENCE_MARKETING,
    name: 'Marketing d\'influence',
    description: 'Collaboration avec des influenceurs pertinents pour promouvoir des produits ou services auprès de leur audience, incluant la sélection des influenceurs, la négociation des contrats et le suivi des performances.',
    price: 5000,
    is_active: true
  },
  {
    type: ServiceType.UX_DESIGN,
    name: 'Optimisation de l\'expérience utilisateur (UX/UI)',
    description: 'Amélioration de la conception et de la fonctionnalité des interfaces utilisateur pour augmenter la satisfaction, l\'engagement et la conversion des visiteurs en clients.',
    price: 7500,
    is_active: true
  },
  {
    type: ServiceType.VOICE_MARKETING,
    name: 'Marketing vocal et podcasting',
    description: 'Création et diffusion de contenus audio, tels que des podcasts ou des messages pour assistants vocaux, visant à atteindre l\'audience via des canaux émergents et à renforcer la présence de la marque.',
    price: 3500,
    is_active: true
  },
  {
    type: ServiceType.ONLINE_REPUTATION,
    name: 'Gestion de la réputation en ligne',
    description: 'Surveillance et amélioration de l\'image de marque sur Internet en gérant les avis clients, en répondant aux commentaires négatifs et en mettant en avant les retours positifs. Cela inclut également la création de contenu positif pour renforcer la présence en ligne.',
    price: 4500,
    is_active: true
  },
  {
    type: ServiceType.EMAIL_MARKETING,
    name: 'Marketing par e-mail (Emailing)',
    description: 'Conception et envoi de campagnes d\'e-mails ciblées pour informer les clients des nouveautés, promotions ou actualités de l\'entreprise. Cela comprend la segmentation de la liste de contacts, la création de contenus engageants et l\'analyse des performances des campagnes.',
    price: 1250,  // Prix moyen entre 500 et 2000 MAD
    is_active: true
  },
  {
    type: ServiceType.FORMATION,
    name: 'Formation et consultation en marketing digital',
    description: 'Offre de sessions de formation personnalisées pour les équipes internes afin de renforcer leurs compétences en marketing digital. Cela peut couvrir des sujets tels que le SEO, la gestion des réseaux sociaux, la publicité en ligne, l\'analyse de données, etc.',
    price: 5000,
    is_active: true
  }
];
