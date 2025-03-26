
const tableDescriptions: Record<string, string> = {
  users: "Utilisateurs de l'application (admins, freelances, clients)",
  contacts: "Prospects et clients potentiels",
  appointments: "Rendez-vous avec les contacts/clients",
  quotes: "Devis envoyés aux prospects",
  quote_items: "Éléments détaillés des devis",
  subscriptions: "Abonnements et contrats actifs",
  commissions: "Commissions des freelances",
  commission_rules: "Règles de calcul des commissions par palier"
};

export const getTableDescription = (table: string): string => {
  return tableDescriptions[table] || "Table de l'application";
};

export default tableDescriptions;
