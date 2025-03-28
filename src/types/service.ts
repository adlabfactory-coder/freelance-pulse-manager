
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: ServiceType;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum ServiceType {
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
  DIGITAL_TRANSFORMATION = 'digital_transformation',
  TRAINING = 'training',
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
  CONSULTING = 'consulting',
  OTHER = 'other'
}

export const ServiceTypeLabels: Record<ServiceType, string> = {
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
  [ServiceType.DIGITAL_TRANSFORMATION]: 'Consultation en transformation numérique',
  [ServiceType.TRAINING]: 'Formation et ateliers',
  [ServiceType.SUBSCRIPTION]: 'Abonnement',
  [ServiceType.ONE_TIME]: 'Service ponctuel',
  [ServiceType.RECURRING]: 'Service récurrent',
  [ServiceType.CONSULTING]: 'Consultation',
  [ServiceType.OTHER]: 'Autre'
};
