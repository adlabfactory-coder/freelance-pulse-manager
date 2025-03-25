
# Instructions pour initialiser la base de données dans Supabase

## Méthode 1: Utilisation de l'interface AdLab Hub

1. Connectez-vous à votre application AdLab Hub
2. Accédez à la page des paramètres 
3. Cliquez sur l'onglet "Base de données" dans le menu latéral
4. Naviguez vers l'onglet "Initialisation"
5. Cliquez sur le bouton "Initialiser la base de données"
6. Suivez la progression de l'initialisation

## Méthode 2: Utilisation directe de l'interface Supabase

1. Connectez-vous à votre dashboard Supabase
2. Sélectionnez votre projet
3. Accédez à l'éditeur SQL (section "Table Editor" > "SQL")
4. Copiez et collez le script SQL depuis le fichier `supabase-init-script.sql`
5. Exécutez le script

## Détails des tables

Le script créera les tables suivantes:

- `users`: Utilisateurs de l'application (admins, freelances, clients)
- `contacts`: Prospects et clients potentiels
- `appointments`: Rendez-vous avec les contacts/clients
- `quotes`: Devis envoyés aux prospects
- `quote_items`: Éléments détaillés des devis
- `subscriptions`: Abonnements et contrats actifs
- `commissions`: Commissions des freelances
- `commission_rules`: Règles de calcul des commissions par palier

## Données de démo

Le script insère également trois utilisateurs de démonstration:
- Admin Démo (admin@example.com)
- Commercial Démo (commercial@example.com)
- Client Démo (client@example.com)
