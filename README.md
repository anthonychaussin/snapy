# Snapy

Snapy est une application de pointage simple conçue pour permettre aux employés de consigner facilement leur temps sur un projet ou un sous-projet, même sans connexion réseau.

## Principe de l'application

- Un employé pointe ou dépointe sur un projet ou, si nécessaire, sur un sous-projet pour indiquer qu'il commence ou arrête de travailler.
- Si aucun sous-projet n'est défini, le pointage se fait directement sur le projet principal.
- Le mode hors ligne permet de capturer les pointages même sans connexion, puis de synchroniser automatiquement quand la connexion revient.
- Les chefs de projet/clients peuvent utiliser ces traces pour améliorer les estimations et détecter les goulots d'étranglement.
- Les RH accèdent aux remontées d'activité pour suivre la présence et la charge de travail des équipes.

## Setup basiques

1. `npm install` – installe les dépendances du projet.
2. `ng serve` – lance un serveur de développement sur `http://localhost:4200/`.

## Commandes utiles

- `npm run build` – génère l'application dans `dist/`.
- `npm test` – exécute les tests unitaires (via Karma).
- `npm run e2e` – exécute les tests bout à bout une fois que vous avez configuré un outil compatible.

## Ressources

Consultez la documentation Angular si vous avez besoin d'aide : https://angular.dev/tools/cli.

## Landing company requests

- La collection `landing_company_requests` stocke les tentatives d'inscription d'une entreprise avant qu'un administrateur ne valide ou n'invite l'équipe.
- Vérifiez que la collection existe dans la console Firebase (Firestore → Collections) et que vos règles autorisent uniquement la création des documents par l'utilisateur connecté.
- Exemple de règle recommandée :
  ```
  match /landing_company_requests/{docId} {
    allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUid;
    allow read, update, delete, list: if false;
  }
  ```
- Pour valider les permissions après modification des règles, exécutez `firebase deploy --only firestore:rules` ou utilisez l'éditeur de règles dans la console Firebase.
