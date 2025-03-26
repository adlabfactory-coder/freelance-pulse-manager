import React from 'react';
import { SubscriptionInterval, SubscriptionStatus } from '@/types';

// Fonction pour formater l'intervalle d'abonnement
export const formatSubscriptionInterval = (interval: SubscriptionInterval): string => {
  switch (interval) {
    case SubscriptionInterval.MONTHLY:
      return 'Mensuel';
    case SubscriptionInterval.QUARTERLY:
      return 'Trimestriel';
    case SubscriptionInterval.BIANNUAL:
      return 'Semestriel';
    case SubscriptionInterval.ANNUAL:
    case SubscriptionInterval.YEARLY:
      return 'Annuel';
    default:
      return 'Inconnu';
  }
};

// Fonction pour obtenir la classe CSS en fonction du statut
export const getStatusColorClass = (status: SubscriptionStatus): string => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return 'text-green-500';
    case SubscriptionStatus.INACTIVE:
      return 'text-red-500';
    case SubscriptionStatus.PENDING:
      return 'text-yellow-500';
    case SubscriptionStatus.CANCELLED:
      return 'text-gray-500';
    case SubscriptionStatus.EXPIRED:
      return 'text-red-700';
    case SubscriptionStatus.TRIAL:
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

export const mockSubscriptionData = [
  {
    id: "S-2023-001",
    name: "Plan Premium",
    clientName: "Alice Martin",
    freelancerName: "John Doe",
    price: 99.99,
    interval: SubscriptionInterval.MONTHLY,
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date(2023, 4, 10),
    renewalDate: new Date(2023, 5, 10),
  },
  {
    id: "S-2023-002",
    name: "Plan Entreprise",
    clientName: "Bob Johnson",
    freelancerName: "Jane Smith",
    price: 299.99,
    interval: SubscriptionInterval.YEARLY,
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date(2023, 3, 15),
    renewalDate: new Date(2024, 3, 15),
  },
  {
    id: "S-2023-003",
    name: "Plan Standard",
    clientName: "Charlie Brown",
    freelancerName: "John Doe",
    price: 49.99,
    interval: SubscriptionInterval.MONTHLY,
    status: SubscriptionStatus.CANCELLED,
    startDate: new Date(2023, 2, 20),
    renewalDate: new Date(2023, 3, 20),
  },
  {
    id: "S-2023-004",
    name: "Plan Premium",
    clientName: "Diana Prince",
    freelancerName: "Jane Smith",
    price: 99.99,
    interval: SubscriptionInterval.MONTHLY,
    status: SubscriptionStatus.TRIAL,
    startDate: new Date(2023, 4, 25),
    renewalDate: new Date(2023, 5, 25),
  },
  {
    id: "S-2023-005",
    name: "Plan Entreprise",
    clientName: "Ethan Hunt",
    freelancerName: "John Doe",
    price: 799.99,
    interval: SubscriptionInterval.QUARTERLY,
    status: SubscriptionStatus.EXPIRED,
    startDate: new Date(2023, 1, 30),
    renewalDate: new Date(2023, 4, 30),
  },
];

export default mockSubscriptionData;
