# IA - Principe de Snapy

Snapy est une application dédiée au suivi des temps pour les équipes. Elle offre un pointage simple, centré sur les projets et leurs éventuels sous-projets, et fonctionne même lorsque l'appareil n'a pas de connexion internet.

## Objectif

- Permettre aux employés de débuter et terminer des plages de travail en quelques clics (pointage/dépoinitage).
- Conserver un historique précis des heures passées par projet ou sous-projet pour guider la facturation, les estimations et le pilotage.
- Garantir une collecte continue des données via un mode hors ligne capable de synchroniser dès que la connectivité revient.

## Fonctionnalités clés

1. **Pointage projet/sous-projet** : l'utilisateur choisit un projet, puis un sous-projet si pertinent (sinon, le projet seul suffit) pour marquer ses débuts et fins de travail.
2. **Mode hors ligne** : les événements de pointage sont stockés localement quand la connexion est absente et propagés automatiquement ensuite.
3. **Visibilité pour le management** : les responsables peuvent analyser les temps dans chaque projet pour affiner les prévisions et prendre de meilleures décisions.
4. **Suivi RH** : les équipes RH retrouvent facilement les activités par collaborateur pour suivre la présence, les heures supplémentaires ou les périodes creuses.

## Cas d’usage

- Un développeur en déplacement pointe sur un sous-projet spécifique de refonte et le système garde la trace même s’il perd le réseau.
- Un manager compare ensuite les temps réels par sous-projet pour ajuster ses estimations et détecter les écarts par rapport aux objectifs.
- Le service RH génère des rapports d’activité pour identifier les besoins en recrutement ou réguler les charges de travail.

Ce document peut servir de référence rapide pour expliquer l’intention métier derrière Snapy ou pour produire une documentation interne.

## Guidelines UI

- Toujours concevoir les vues avec les composants fournis par Ionic (ex. `ion-header`, `ion-button`, `ion-list`).
- Ne jamais introduire de balises HTML classiques ni des `class` CSS personnalisées pour les widgets ; s’appuyer uniquement sur la bibliothèque Ionic pour l’UI et les styles.

## Écrans clés

- **Landing (`landing.component`)** : page marketing qui présente la promesse de Snapy, donne accès à la connexion/exploration et guide les visiteurs vers l’inscription d’une entreprise ou d’un employé.
- **Connexion (`login.component`)** : formulaire Ionic enregistrant l’e-mail/mot de passe, qui vérifie la validation du mail et redirige vers `/onboarding` ou `/dashboard` via `OnboardingService.hasProfile`.
- **Enregistrer une entreprise (`register-company.component`)** : collecte nom d’entreprise, e-mail et mot de passe, appelle `AuthStore.register`, met à jour le `displayName`, envoie un e-mail de confirmation puis propose d’aller vers la page d’attente.
- **Créer un compte employé (`register-employee.component`)** : nécessite une invitation (`inviteId` ou e-mail pending) via `CompanyMembershipService`, crée un compte après validation et rappelle l’utilisateur de confirmer son e-mail avant de rejoindre l’entreprise.
- **Page d’attente (`waiting.component`)** : recharge régulièrement l’utilisateur connecté, attend la validation de l’e-mail et déclenche `CompanyMembershipService.activateInvite` pour passer la relation en statut `active`.
- **Onboarding entreprise (`onboarding.component`)** : formulaire de complétion du profil (nom, secteur, contacts, description) sauvegardé grâce à `OnboardingService.saveProfile` puis redirection vers le tableau de bord.
- **Tableau de bord (`dashboard.component`)** : synthèse des données de l’entreprise (stocks via `CompanyStore`, `ProjectStore`, `TaskStore`), formulaire d’invitation avec rôle (`CompanyMembershipService.invite`) et mise à jour des informations d’entreprise via `OnboardingService.updateProfile`.
- **Ressources humaines (`human-resources.component`)** : gestion des invitations, suivi des membres actifs/pending ainsi que des rôles, suivi d’indicateurs (heures, télétravail) géré dans un signal local.
- **Gestion manager (`gestion-manager.component`)** : carte résumant le pilotage des responsabilités des managers et les indicateurs associés.
- **Gestion projet (`gestion-projet.component`)** : carte dédiée au suivi des projets, des étapes clés et des ressources mobilisées pour chaque équipe.
- **Pointage (`pointage.component`)** : écran de pointage qui permet aux employés de démarrer/terminer une plage horaire et centralise les heures par projet.

## Flux métier

1. **Création et configuration d’une entreprise**
  - Le visiteur déclenche l’inscription via le formulaire de `register-company`, qui crée un utilisateur Firebase, met le nom d’entreprise dans `AuthService.updateDisplayName` et envoie une confirmation par mail.
  - Après validation du mail, `waiting.component` recharge l’utilisateur et, dès qu’il devient vérifié, appelle `CompanyMembershipService.activateInvite` (avec l’`inviteId` éventuel) puis bascule vers `/dashboard`.
  - Si l’entreprise n’a pas encore de profil, `login.component` redirige vers `/onboarding`; le formulaire collecte les métadonnées et les enregistre dans `company_profiles` via `OnboardingService.saveProfile` pour permettre les accès administrateur.

2. **Ajout d’un utilisateur**
  - Les responsables (administrateur, RH) créent un invité depuis `dashboard` ou `ressources-humaines` en appelant `CompanyMembershipService.invite(email, ownerUid, role)` => document `company_memberships` avec `status: 'pending'` et le rôle souhaité.
  - L’invité reçoit un lien `/register-employee?inviteId=…` ; la page `register-employee` valide l’invitation (par `inviteId` ou par e-mail pendante) avant de créer les identifiants et d’envoyer la confirmation par mail.
  - Une fois le mail validé, `waiting.component` appelle `activateInvite`, ce qui saute le `status` à `active`, attache l’`employeeUid` et permet à l’utilisateur d’accéder aux écrans autorisés.

## Rôles et droits

- **Administrateur** (`RoleType.ADMIN`) : seul profil doté d’un `company profile` ; accède à `dashboard`, `ressources-humaines` et `gestion-manager` pour piloter l’organisation complète, inviter des collaborateurs et ajuster les rôles.
- **Ressources humaines** (`RoleType.HR`) : gère les invitations et les configurations de suivi (`human-resources`) tout en gardant accès au `pointage` pour vérifier les temps ; leurs menus sont limités au RH et au pointage.
- **Chef de projet** (`RoleType.MANAGER`) : accès à `gestion-projet` et `pointage` pour coordonner les équipes sur des livrables et suivre les heures associées.
- **Employé** (`RoleType.EMPLOYEE`) : accès unique à `pointage` pour consigner ses heures sur les projets qui lui sont assignés.

Chaque rôle correspond à l’entrée `MENU_BY_ROLE` dans `app.component.ts`, donc ajouter ou retirer une route implique de tenir à jour ces menus. L’état d’un membre (`pending`/`active`) provient de `CompanyMembershipService`, et les permissions applicatives sont découlées de ce statut + du rôle stocké dans Firestore.
