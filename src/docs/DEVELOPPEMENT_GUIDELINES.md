
# Directives de Développement AdLab Hub

Ce document présente les standards et bonnes pratiques à suivre lors du développement de l'application AdLab Hub.

## Standards Généraux

### Code

- Utiliser TypeScript pour tout le code
- Respecter le formatage automatique (Prettier)
- Suivre les règles ESLint configurées
- Préférer les composants fonctionnels et les hooks React

### Naming

- CamelCase pour les variables, fonctions et propriétés
- PascalCase pour les composants, interfaces et types
- UPPERCASE pour les constantes

## Standards Spécifiques

### Devises

**L'unique devise acceptée est le Dirham Marocain (MAD)**

Voir [CURRENCY_STANDARDS.md](./CURRENCY_STANDARDS.md) pour les détails complets.

### Dates

- Toujours utiliser les fonctions de formatage de `src/utils/format.ts`
- Stocker les dates au format ISO dans la base de données

### Régionalisation

- L'application est principalement en français
- Utiliser les formatages adaptés au Maroc (dates, nombres, devises)

## Structure du Projet

### Composants

- Les composants réutilisables doivent être placés dans `/src/components/ui`
- Les composants spécifiques aux fonctionnalités dans `/src/components/[feature]`
- Créer des sous-composants quand la complexité augmente

### Hooks

- Créer des hooks personnalisés pour la logique réutilisable
- Les placer dans `/src/hooks` ou `/src/hooks/[feature]`

### Services

- La logique métier doit être placée dans `/src/services`
- Les appels API dans des fichiers séparés

## Vérifications Avant Commit

Avant de soumettre vos modifications, assurez-vous que :

1. Le code compile sans erreur
2. Les tests passent
3. Vous avez respecté les standards de devise (MAD uniquement)
4. Aucune information sensible n'est exposée
5. La documentation a été mise à jour si nécessaire
