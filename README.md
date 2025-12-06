# DevOps-Workshop

Un **projet micro-services DevOps complet** avec 4 services indépendants
déployables en local, via Docker Compose ou encore Kubernetes.

## 📊 Architecture Globale

```text
DevOps-Workshop/
├── docker-compose.yml              # Orchestration Docker
├── README.md                       # Cette documentation
├── auth-service/                   # Authentification (FastAPI/Python)
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── ...
│   └── README.md                   # Documentation spécifique
├── order-service/                  # Commandes (NestJS/TypeScript)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── .env.example
│   ├── ...
│   └── README.md                   # Documentation spécifique
├── breweries-service/              # Brasseries (Express/TypeScript)
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   ├── ...
│   └── README.md                   # Documentation spécifique
├── frontend/                       # Interface utilisateur (Next.js)
│   ├── app/
│   ├── lib/
│   ├── package.json
│   ├── .env.local
│   ├── ...
│   └── README.md                   # Documentation spécifique
└── k8s/                            # Manifests Kubernetes
    ├── auth/
    ├── order/
    ├── breweries/
    ├── frontend/
    └── ingress/
```

## 🔧 Services Individuels

### 1. [**Frontend**](./frontend/README.md) (Next.js)

Port: `3000`

Interface utilisateur React avec :

- Page d'accueil
- Authentification (login/logout)
- Listing des brasseries avec favoris
- Gestion des commandes
- Dashboard utilisateur

---

### 2. [**Auth Service**](./auth-service/README.md) (FastAPI/Python)

Port: `8000`

Authentification centralisée :

- Émission des JWT tokens
- Validation des credentials
- Rafraîchissement des tokens
- Endpoints JWKS publiques

---

### 3. [**Breweries Service**](./breweries-service/README.md) (Express/TypeScript)

Port: `3001`

Gestion des brasseries et favoris :

- Intégration avec l'API publique [OpenBreweryDB](https://www.openbrewerydb.org/)
- Récupération et filtrage des brasseries
- Système de favoris utilisateur (base SQLite)
- Endpoints protégés par JWT

---

### 4. [**Order Service**](./order-service/README.md) (NestJS)

Port: `4000`

Gestion des commandes :

- Création de commandes
- Consultation et suppression
- Association aux utilisateurs
- Stockage avec Prisma/SQLite

---

## 🚀 Lancement du Projet

### Mode Local (Développement)

**Prérequis** :

- Python 3.9+
- Node.js 20+
- npm

**Lancement** :

```bash
# Terminal 1: Auth Service
cd auth-service
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

```bash
# Terminal 2: Order Service
cd order-service
npm install
npm run start:dev
```

```bash
# Terminal 3: Breweries Service
cd breweries-service
npm install
npm run dev
```

```bash
# Terminal 4: Frontend
cd frontend
npm install
npm run dev
```

Accès au frontend: **<http://localhost:3000>**

---

### Mode Docker Compose

**Prérequis** : Docker et Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter
docker-compose down
```

---

### Mode Kubernetes

**Prérequis** : kubectl configuré et cluster Kubernetes actif

```bash
# Déployer tous les services
kubectl apply -f k8s/

# Vérifier le statut
kubectl get pods
kubectl get svc
kubectl get ingress

# Port-forward pour accéder au frontend
kubectl port-forward svc/frontend 3000:3000

# Accès via ingress (si configuré)
# Ajouter à /etc/hosts: 127.0.0.1 devops.local
# Puis visiter: http://devops.local
```

---

## 🔐 Configuration des Variables d'Environnement

### Frontend

**Fichier** : `frontend/.env.local` (développement) / `frontend/.env` (production)

```env
# À remplacer selon votre environnement

# URL de base du frontend
NEXT_PUBLIC_API_BASE=http://localhost:3000/api

# Services internes
AUTH_SERVICE_URL=http://localhost:8000                  # À remplacer : http://auth-service:8000 en Docker/K8s
ORDER_SERVICE_URL=http://localhost:4000/orders          # À remplacer : http://order-service:4000/orders en Docker/K8s
BREWERIES_SERVICE_URL=http://localhost:3001             # À remplacer : http://breweries-service:3001 en Docker/K8s
```

---

### Auth Service

**Fichier** : `auth-service/.env`

```env
# Secret JWT (partagé entre tous les services - À CHANGER EN PRODUCTION)
JWT_SECRET=your-super-secret-key-change-in-production

# Configuration JWT
JWT_ALGO=HS256
ACCESS_TOKEN_EXPIRES_MIN=60
REFRESH_TOKEN_EXPIRES_MIN=43200

# CORS autorisés (À adapter selon votre environnement)
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:3001

# En Docker Compose, remplacer par :
# CORS_ORIGINS=http://frontend:3000,http://order-service:4000,http://breweries-service:3001
```

---

### Breweries Service

**Fichier** : `breweries-service/.env`

```env
# Port
PORT=3001

# Secret JWT (doit être identique à auth-service - À CHANGER EN PRODUCTION)
JWT_SECRET=your-super-secret-key-change-in-production

# Base de données SQLite
DB_PATH=./breweries.db

# En production
NODE_ENV=production
```

---

### Order Service

**Fichier** : `order-service/.env`

```env
# Port
PORT=4000

# Secret JWT (doit être identique à auth-service - À CHANGER EN PRODUCTION)
JWT_SECRET=your-super-secret-key-change-in-production

# Base de données Prisma
DATABASE_URL=file:./dev.db

# En production
NODE_ENV=production
```

---

## ⚠️ Points Importants

1. **JWT Secret Partagé** : Tous les services utilisent la même clé `JWT_SECRET`
2. **Service Discovery** : En Docker/K8s, utiliser les noms de service au lieu de `localhost`
3. **Volumes Persistants** : SQLite data persiste via volumes Docker
4. **Health Checks** : Chaque service expose `/health`
5. **CORS** : Frontend doit être autorisé dans `CORS_ORIGINS`

---

## 📝 API Endpoints Principaux

| Méthode | Route | Authentification | Description |
|---------|-------|-----------------|-------------|
| POST | `/api/auth-login` | Non | Login utilisateur |
| POST | `/api/auth-logout` | Oui | Logout |
| POST | `/api/refresh` | Oui | Rafraîchir token |
| GET | `/api/breweries` | Oui | Lister brasseries |
| GET | `/api/breweries?type=random` | Oui | Brasserie aléatoire |
| POST | `/api/favorites` | Oui | Ajouter aux favoris |
| DELETE | `/api/favorites/:id` | Oui | Retirer des favoris |
| GET | `/api/orders` | Oui | Lister commandes |
| POST | `/api/orders` | Oui | Créer commande |

---

## 📦 Technologies Utilisées

- **Frontend** : Next.js 16, React, TypeScript
- **Auth Service** : FastAPI, Python 3.9+
- **Order Service** : NestJS, TypeScript
- **Breweries Service** : Express, TypeScript
- **Bases de données** : SQLite, Prisma ORM
- **Authentification** : JWT
- **Containerization** : Docker, Docker Compose
- **Orchestration** : Kubernetes
- **API externe** : OpenBreweryDB (lecture seule)

---

**Version** : 1.0
**Dernière mise à jour** : Décembre 2025
