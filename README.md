# RailRoad API

RailRoad API est une application RESTful développée avec Node.js et Express.js. Elle gère les utilisateurs, les trains, les stations et les tickets pour une plateforme de gestion de transports ferroviaires.

## Table des matières
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Exécution](#exécution)
- [Fonctionnalités](#fonctionnalités)
  - [Gestion des utilisateurs](#gestion-des-utilisateurs)
  - [Authentification](#authentification)
  - [Gestion des trains](#gestion-des-trains)
  - [Gestion des stations](#gestion-des-stations)
  - [Gestion des tickets](#gestion-des-tickets)
- [Documentation Swagger](#documentation-swagger)
- [Tests](#tests)

## Prérequis

Avant de démarrer, assurez-vous d'avoir les éléments suivants installés :

- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Installation

1. Installez les dépendances du projet :

   ```bash
   npm install
   ```

## Configuration

1. Créez un fichier `.env` dans le fichier Railroad et configurez les variables d'environnement suivantes :

   ```
   MONGODB_URI=mongodb+srv://YLD:n18ulYf1tRxECMW0@blogify-api.d8oni.mongodb.net/3API?retryWrites=true&w=majority&appName=Blogify-API
   JWT_SECRET=your_jwt_secret
   ```

2. Configurez les autres variables si nécessaire, comme la chaîne de connexion MongoDB.

## Exécution

Pour lancer l'API en mode développement :

```bash
npm start``
```

L'API sera disponible à l'adresse [http://localhost:5001](http://localhost:5001).

## Fonctionnalités

### Gestion des utilisateurs

- **Inscription** (`POST /api/auth/register`) : Crée un nouvel utilisateur avec les champs suivants : `username`, `email`, `pseudo`, `password`, et `role`.
- **Connexion** (`POST /api/auth/login`) : Authentifie un utilisateur avec son `email` et `password`.
- **Profil utilisateur** (`GET /api/users/profile`) : Récupère les informations de l'utilisateur connecté.
- **Modification de profil** (`PUT /api/users/:id?`) : Un utilisateur peut modifier son profil (ou un admin peut modifier les autres utilisateurs).
- **Suppression de compte** (`DELETE /api/users/profile`) : Permet à un utilisateur de supprimer son propre compte (token requis).

### Authentification

L'authentification est gérée via JWT (JSON Web Tokens). Les utilisateurs doivent fournir un token JWT valide dans l'en-tête `Authorization` pour accéder aux routes protégées.

### Gestion des trains

- **Lister les trains** (`GET /api/trains/`) : Accessible par tout utilisateur sans authentification. 
- **Créer un train** (`POST /api/trains/`) : Réservé aux admins.
- **Modifier un train** (`PUT /api/trains/:id`) : Réservé aux admins.
- **Supprimer un train** (`DELETE /api/trains/:id`) : Réservé aux admins.

### Gestion des stations

- **Lister les stations** (`GET /api/stations/`) : Liste les stations avec des options de tri.
- **Créer une station** (`POST /api/stations/`) : Réservé aux admins.
- **Modifier une station** (`PUT /api/stations/:id`) : Réservé aux admins.
- **Supprimer une station** (`DELETE /api/stations/:id`) : Réservé aux admins. Lorsqu'une station est supprimée, les trains liés sont également affectés.

### Gestion des tickets

- **Réserver un ticket** (`POST /api/tickets/`) : Les utilisateurs authentifiés peuvent réserver un ticket pour un train.
- **Valider un ticket** (`PUT /api/tickets/:id/validate`) : Valide un ticket réservé pour un utilisateur.

## Documentation Swagger

L'API dispose d'une documentation générée automatiquement avec Swagger. Pour y accéder, démarrez l'application et rendez-vous sur [http://localhost:5001/api-docs](http://localhost:5001/api-docs).

Le fichier `swagger-output.json` est généré automatiquement à partir des routes définies dans `app.js` et les fichiers correspondants.

Pour générer la documentation Swagger à nouveau :

```bash
npm run swagger-autogen
```

## Tests

Des tests unitaires sont inclus pour vérifier le bon fonctionnement de l'API. Pour exécuter les tests :

```bash
npm run test
```
