
import { ServiceType } from '@/types/service';
import { supabase } from '@/lib/supabase-client';

export const agencyServicesData = [
  {
    name: 'Création de contenu blog',
    description: 'Rédaction d\'articles de blog optimisés SEO pour votre site web.',
    price: 500,
    type: ServiceType.CONTENT_MARKETING,
    is_active: true
  },
  {
    name: 'Gestion complète des réseaux sociaux',
    description: 'Publication, engagement et analyse de votre présence sur les réseaux sociaux.',
    price: 800,
    type: ServiceType.SOCIAL_MEDIA,
    is_active: true
  },
  {
    name: 'Création de site web vitrine',
    description: 'Conception et développement d\'un site web professionnel responsive.',
    price: 2500,
    type: ServiceType.WEB_DEVELOPMENT,
    is_active: true
  },
  {
    name: 'Mise en place e-commerce',
    description: 'Création d\'une boutique en ligne complète avec système de paiement.',
    price: 3500,
    type: ServiceType.ECOMMERCE,
    is_active: true
  },
  {
    name: 'Rapport d\'analyse mensuel',
    description: 'Analyse détaillée des performances de vos campagnes marketing.',
    price: 300,
    type: ServiceType.DATA_ANALYSIS,
    is_active: true
  },
  {
    name: 'Automatisation des emails marketing',
    description: 'Mise en place de scénarios d\'emails automatisés et personnalisés.',
    price: 600,
    type: ServiceType.MARKETING_AUTOMATION,
    is_active: true
  },
  {
    name: 'Campagne avec micro-influenceurs',
    description: 'Collaboration avec 5 micro-influenceurs dans votre secteur.',
    price: 1200,
    type: ServiceType.INFLUENCE_MARKETING,
    is_active: true
  },
  {
    name: 'Audit et amélioration UX',
    description: 'Analyse et optimisation de l\'expérience utilisateur de votre site.',
    price: 900,
    type: ServiceType.UX_DESIGN,
    is_active: true
  },
  {
    name: 'Création de podcast branded',
    description: 'Conception, enregistrement et diffusion d\'un podcast pour votre marque.',
    price: 1500,
    type: ServiceType.VOICE_MARKETING,
    is_active: true
  },
  {
    name: 'Gestion de la réputation en ligne',
    description: 'Surveillance et gestion des avis et de votre image sur internet.',
    price: 700,
    type: ServiceType.ONLINE_REPUTATION,
    is_active: true
  },
  {
    name: 'Consultation transformation digitale',
    description: 'Accompagnement dans la digitalisation de votre entreprise.',
    price: 2000,
    type: ServiceType.DIGITAL_TRANSFORMATION,
    is_active: true
  },
  {
    name: 'Formation marketing digital',
    description: 'Formation d\'une journée pour votre équipe sur les outils marketing.',
    price: 1200,
    type: ServiceType.TRAINING,
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
