# Breweries Service

Un service TypeScript/Express qui récupère des données sur les brasseries depuis l'API **Open Brewery DB** et permet aux utilisateurs authentifiés de gérer leurs favoris.

## Fonctionnalités

- ✅ **Intégration API publique** : Consomme [Open Brewery DB API](https://www.openbrewerydb.org/)
- ✅ **Authentification JWT** : Intégration avec l'auth-service
- ✅ **Persistance de données** : Base SQLite pour stocker les favoris
- ✅ **Endpoints protégés** : Toutes les routes nécessitent un JWT valide
- ✅ **Health checks** : Endpoint `/health` pour la détection d'état
- ✅ **Support multi-déploiement** : Local, Docker Compose, Kubernetes

## API Endpoints Principaux

### Brasseries (Protégés - JWT requis)

- `GET /breweries` - Tous les brasseries
- `GET /breweries/random` - Brasserie aléatoire
- `GET /breweries/country/:country` - Par pays

### Favoris (Protégés - JWT requis)

- `GET /favorites` - Récupérer les favoris
- `POST /favorites` - Ajouter un favori
- `DELETE /favorites/:breweryId` - Retirer un favori
- `GET /favorites/:breweryId/check` - Vérifier si favori

### Santé

- `GET /health` - État du service (pas d'authentification)

## Installation & Démarrage

### Mode Local

```bash
npm install
npm run dev      # Développement
npm run build    # Builder
npm start        # Production
```

### Mode Docker Compose

```bash
docker-compose up -d breweries-service
```

### Mode Kubernetes

```bash
kubectl apply -f k8s/breweries/
kubectl get pods -l app=breweries-service
```

## Variables d'Environnement

```env
PORT=3001
JWT_SECRET=your-shared-secret-key
DB_PATH=./breweries.db
NODE_ENV=production
```

## Technologies

- Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- Axios

## Intégration Frontend

Le frontend communique via:

- `/api/favorites` - Routes intermédiaires Next.js
- `/api/breweries` - Proxy vers ce service
