
# Standards de devise pour AdLab Hub

## Règle générale

**L'unique devise acceptée dans l'application AdLab Hub est le Dirham Marocain (MAD).**

## Implémentation

Pour assurer la cohérence et éviter les erreurs liées à la devise :

1. **Utiliser les constantes** : Toujours référencer la devise via les constantes définies dans `src/constants/currency.ts`.

2. **Formater les montants** : Utiliser la fonction `formatCurrency()` de `src/utils/format.ts` pour tous les affichages de montants.

3. **Interface utilisateur** : Lorsque vous demandez à l'utilisateur d'entrer un montant, spécifiez toujours "(MAD)" dans les libellés des champs.

4. **Documentation** : Dans les commentaires, préciser "MAD" lorsqu'il est question de montants ou de devise.

5. **Base de données** : Tous les montants sont stockés sans symbole de devise et représentent des valeurs en MAD.

## Modification des standards

Si une nouvelle devise doit être ajoutée à l'avenir (ce qui n'est pas prévu), les modifications suivantes seraient nécessaires :

1. Mise à jour du fichier `src/constants/currency.ts`
2. Révision de toutes les fonctions de formatage
3. Ajout d'un champ "devise" dans les tables concernées de la base de données
4. Mise à jour de tous les affichages et formulaires

## Lors du développement

✅ **À FAIRE** :
- Utiliser les fonctions de formatage existantes
- Référencer MAD dans les interfaces utilisateur
- Utiliser les constantes définies

❌ **À ÉVITER** :
- Coder en dur une autre devise (€, $, etc.)
- Créer une nouvelle fonction de formatage de devise
- Omettre de préciser MAD dans les interfaces utilisateur
