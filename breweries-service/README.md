# Breweries Service

Service Express/TypeScript pour gérer les brasseries (Open Brewery DB API) et les favoris utilisateur.

**Port** : `3001` | **Framework** : Express | **Langage** : TypeScript | **BD** : SQLite

---

## 📁 Structure

```text
breweries-service/
├── src/
│   ├── app.ts                      # Entry point Express
│   ├── routes/
│   │   └── breweries.ts            # Définition des routes
│   ├── controllers/
│   │   ├── breweriesController.ts  # Logique breweries
│   │   ├── favoritesController.ts  # Logique favoris
│   │   └── healthController.ts     # Health check
│   ├── services/
│   │   ├── breweryService.ts       # Intégration API externe
│   │   └── favoritesService.ts     # Gestion favoris DB
│   ├── db/
│   │   └── database.ts             # Configuration SQLite
│   ├── middleware/
│   │   └── auth.ts                 # Validation JWT
│   └── types/
│       └── index.d.ts              # Définitions TypeScript
├── package.json
├── package-lock.json
├── tsconfig.json
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Lancement

### Local

```bash
cd breweries-service
npm install
npm run dev
```

API : <http://localhost:3001>

### Docker

```bash
docker build -t breweries-service .
docker run -p 3001:3001 -e JWT_SECRET=your-secret-key breweries-service
```

### Docker Compose / Kubernetes

```bash
docker-compose up -d breweries-service
kubectl apply -f k8s/breweries/
```

---

## 🔐 Configuration (`.env`)

```env
PORT=3001
JWT_SECRET=your-super-secret-key-change-in-production
DB_PATH=./breweries.db
NODE_ENV=production
```

⚠️ **Important** : `JWT_SECRET` doit être **identique** à celui de l'auth-service !

---

## 📡 API Endpoints

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/breweries` | Liste toutes les brasseries | ✅ |
| GET | `/breweries/random` | Brasserie aléatoire | ✅ |
| GET | `/breweries/country/:country` | Brasseries par pays | ✅ |
| GET | `/favorites` | Favoris utilisateur | ✅ |
| POST | `/favorites` | Ajouter un favori | ✅ |
| DELETE | `/favorites/:breweryId` | Retirer un favori | ✅ |
| GET | `/health` | Health check | ❌ |

### Ajouter un favori

```bash
curl -X POST http://localhost:3001/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"breweryId":"abc123","name":"BrewDog","city":"Aberdeen"}'
```

---

## 🛠️ Troubleshooting

| Problème | Solution |
|----------|----------|
| Port 3001 in use | Changer `PORT` dans `.env` |
| JWT validation failed | Vérifier `JWT_SECRET` identique à auth-service |
| Database locked | Redémarrer le service |
| API externe timeout | Vérifier connexion à openbrewerydb.org |

---

## 📚 Documentation

- [Open Brewery DB API](https://www.openbrewerydb.org/)
- [Express.js Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)

---

**Version** : 1.0  
**Dernière mise à jour** : Décembre 2025
