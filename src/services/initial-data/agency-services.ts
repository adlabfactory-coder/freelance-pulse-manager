
import { ServiceType } from '@/types/service';
import { supabase } from '@/lib/supabase-client';

export const agencyServicesData = [
  {
    name: 'Stratégie de marketing digital',
    description: 'Élaboration d\'un plan stratégique personnalisé visant à atteindre les objectifs commerciaux en ligne de l\'entreprise. Cela inclut l\'analyse du marché, l\'identification du public cible, la sélection des canaux de communication appropriés et la définition des indicateurs de performance clés (KPI).',
    price: 5000,
    type: ServiceType.DIGITAL_STRATEGY,
    is_active: true
  },
  {
    name: 'Optimisation pour les moteurs de recherche (SEO)',
    description: 'Amélioration de la visibilité du site web sur les moteurs de recherche grâce à l\'optimisation des contenus, des balises méta, de la structure du site et à la création de backlinks de qualité.',
    price: 2500,
    type: ServiceType.SEO,
    is_active: true
  },
  {
    name: 'Publicité en ligne (SEA)',
    description: 'Gestion de campagnes publicitaires payantes sur des plateformes telles que Google Ads ou Facebook Ads, incluant la création d\'annonces, le ciblage de l\'audience, le suivi des performances et l\'optimisation des budgets.',
    price: 1500,
    type: ServiceType.SEA,
    is_active: true
  },
  {
    name: 'Création de contenu marketing',
    description: 'Création et diffusion de contenus pertinents et engageants, tels que des articles de blog, des vidéos, des infographies, visant à attirer et fidéliser l\'audience cible.',
    price: 1000,
    type: ServiceType.CONTENT_MARKETING,
    is_active: true
  },
  {
    name: 'Gestion complète des réseaux sociaux',
    description: 'Développement et mise en œuvre de stratégies sur les plateformes sociales, incluant la création de contenu, la gestion des publications, l\'interaction avec la communauté et l\'analyse des performances.',
    price: 1500,
    type: ServiceType.SOCIAL_MEDIA,
    is_active: true
  },
  {
    name: 'Développement de site web professionnel',
    description: 'Conception et développement de sites web sur mesure, optimisés pour une expérience utilisateur fluide et adaptés aux différents appareils.',
    price: 6000,
    type: ServiceType.WEB_DEVELOPMENT,
    is_active: true
  },
  {
    name: 'Création de boutique e-commerce complète',
    description: 'Création et gestion de boutiques en ligne, incluant l\'intégration de systèmes de paiement sécurisés, la gestion des stocks, l\'optimisation de l\'expérience utilisateur et la mise en place de stratégies de conversion.',
    price: 15000,
    type: ServiceType.ECOMMERCE,
    is_active: true
  },
  {
    name: 'Rapport d\'analyse et reporting mensuel',
    description: 'Collecte, analyse et interprétation des données relatives aux performances des campagnes marketing, fournissant des rapports détaillés et des recommandations pour optimiser les stratégies en cours.',
    price: 2000,
    type: ServiceType.DATA_ANALYSIS,
    is_active: true
  },
  {
    name: 'Automatisation des emails marketing',
    description: 'Mise en place de systèmes automatisés pour gérer des tâches marketing répétitives, telles que l\'envoi d\'e-mails, le suivi des leads et la segmentation de l\'audience, améliorant ainsi l\'efficacité et la personnalisation des campagnes.',
    price: 2500,
    type: ServiceType.MARKETING_AUTOMATION,
    is_active: true
  },
  {
    name: 'Campagne avec micro-influenceurs',
    description: 'Collaboration avec des influenceurs pertinents pour promouvoir des produits ou services auprès de leur audience, incluant la sélection des influenceurs, la négociation des contrats et le suivi des performances.',
    price: 3000,
    type: ServiceType.INFLUENCE_MARKETING,
    is_active: true
  },
  {
    name: 'Audit et amélioration UX/UI',
    description: 'Amélioration de la conception et de la fonctionnalité des interfaces utilisateur pour augmenter la satisfaction, l\'engagement et la conversion des visiteurs en clients.',
    price: 4000,
    type: ServiceType.UX_DESIGN,
    is_active: true
  },
  {
    name: 'Création de podcast branded',
    description: 'Création et diffusion de contenus audio, tels que des podcasts ou des messages pour assistants vocaux, visant à atteindre l\'audience via des canaux émergents et à renforcer la présence de la marque.',
    price: 3500,
    type: ServiceType.VOICE_MARKETING,
    is_active: true
  },
  {
    name: 'Gestion de la réputation en ligne',
    description: 'Surveillance et amélioration de l\'image de marque sur Internet en gérant les avis clients, en répondant aux commentaires négatifs et en mettant en avant les retours positifs. Cela inclut également la création de contenu positif pour renforcer la présence en ligne.',
    price: 2000,
    type: ServiceType.ONLINE_REPUTATION,
    is_active: true
  },
  {
    name: 'Campagne d\'emailing',
    description: 'Conception et envoi de campagnes d\'e-mails ciblées pour informer les clients des nouveautés, promotions ou actualités de l\'entreprise. Cela comprend la segmentation de la liste de contacts, la création de contenus engageants et l\'analyse des performances des campagnes.',
    price: 1000,
    type: ServiceType.EMAIL_MARKETING,
    is_active: true
  },
  {
    name: 'Formation marketing digital',
    description: 'Offre de sessions de formation personnalisées pour les équipes internes afin de renforcer leurs compétences en marketing digital. Cela peut couvrir des sujets tels que le SEO, la gestion des réseaux sociaux, la publicité en ligne, l\'analyse de données, etc.',
    price: 5000,
    type: ServiceType.FORMATION,
    is_active: true
  },
  {
    name: 'Consultation transformation digitale',
    description: 'Accompagnement des entreprises dans l\'intégration de technologies numériques pour optimiser leurs opérations et modèles commerciaux.',
    price: 8000,
    type: ServiceType.DIGITAL_TRANSFORMATION,
    is_active: true
  }
];

/**
 * Fonction pour initialiser les services de l'agence dans la base de données
 */
export const initializeAgencyServices = async () => {
  try {
    const { data: existingServices, error: fetchError } = await supabase
      .from('services')
      .select('id');
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Si des services existent déjà, ne pas initialiser
    if (existingServices && existingServices.length > 0) {
      console.log('Services déjà initialisés, opération ignorée');
      return {
        success: true,
        message: 'Les services étaient déjà initialisés'
      };
    }
    
    const { error: insertError } = await supabase
      .from('services')
      .insert(agencyServicesData);
      
    if (insertError) {
      throw insertError;
    }
    
    return {
      success: true,
      message: 'Services initialisés avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des services:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'initialisation des services',
      error
    };
  }
};
