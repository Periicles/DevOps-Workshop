# DevOps-Workshop

Un projet micro-services DevOps complet avec 4 services indépendants déployables en local, via Docker Compose ou Kubernetes.

## Description

Ce projet démontre une architecture micro-services complète avec :

- Service d'authentification centralisé (FastAPI/Python)
- Service de gestion des commandes (NestJS/TypeScript)
- Service de gestion des brasseries et favoris (Express/TypeScript)
- Interface utilisateur moderne (Next.js/React)

Les services communiquent via API REST avec authentification JWT et peuvent être déployés de trois manières différentes : en développement local, via Docker Compose ou sur Kubernetes.

## Architecture Globale

```text
DevOps-Workshop/
├── docker-compose.yml              # Orchestration Docker
├── README.md
├── auth-service/                   # Authentification (FastAPI/Python)
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── ...
├── order-service/                  # Commandes (NestJS/TypeScript)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
├── breweries-service/              # Brasseries (Express/TypeScript)
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
├── frontend/                       # Interface utilisateur (Next.js)
│   ├── app/
│   ├── lib/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
└── k8s/                            # Manifests Kubernetes
    ├── auth/
    ├── order/
    ├── breweries/
    ├── frontend/
    └── ingress/
```

## Services

### Frontend (Next.js) - Port 3000

Interface utilisateur React avec :

- Authentification (login/logout)
- Listing des brasseries avec système de favoris
- Gestion des commandes
- Dashboard utilisateur

### Auth Service (FastAPI/Python) - Port 8000

Service d'authentification centralisé :

- Emission et validation des JWT tokens
- Rafraichissement des tokens
- Endpoints JWKS publiques
- Stockage des utilisateurs dans SQLite

### Breweries Service (Express/TypeScript) - Port 3001

Gestion des brasseries et favoris :

- Integration avec l'API [OpenBreweryDB](https://www.openbrewerydb.org/) (Pas de clé API requise)
- Recuperation et filtrage des brasseries
- Systeme de favoris utilisateur (SQLite)
- Endpoints proteges par JWT

### Order Service (NestJS) - Port 4000

Gestion des commandes :

- Creation et consultation des commandes
- Association aux utilisateurs
- Stockage avec Prisma/SQLite

## Installation et Lancement

### 1. Mode Local (Developpement)

Prerequis :

- Python 3.9+
- Node.js 20+
- npm

Vous aurez besoin de 4 terminaux distincts :

**Terminal 1 - Auth Service :**

```bash
cd auth-service
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Order Service :**

```bash
cd order-service
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

**Terminal 3 - Breweries Service :**

```bash
cd breweries-service
npm install
npm run dev
```

**Terminal 4 - Frontend :**

```bash
cd frontend
npm install
npm run dev
```

Acces au frontend : <http://localhost:3000>

### 2. Mode Docker Compose

Prerequis : Docker et Docker Compose installés

```bash
# Demarrer tous les services
docker-compose up -d

# Verifier les logs
docker-compose logs -f

# Arreter les services
docker-compose down
```

Acces au frontend : <http://localhost:3000>

### 3. Mode Kubernetes Local

Prerequis :

- kubectl configuré
- Minikube installé
- Docker installé
- Compte Docker Hub

#### Etape 1 : Demarrer Minikube

```bash
minikube start --driver=docker --cpus=4 --memory=5000mb
```

#### Etape 2 : Construction et publication des images Docker

```bash
# Se connecter a Docker Hub
docker login

# Construire les images
docker build -t juliencouraud/frontend:latest frontend/
docker build -t juliencouraud/order-service:latest order-service/
docker build -t juliencouraud/auth-service:latest auth-service/
docker build -t juliencouraud/breweries-service:latest breweries-service/

# Publier sur Docker Hub
docker push juliencouraud/frontend:latest
docker push juliencouraud/order-service:latest
docker push juliencouraud/auth-service:latest
docker push juliencouraud/breweries-service:latest
```

Note : Remplacer `juliencouraud` par votre nom d'utilisateur Docker Hub et mettre a jour les fichiers `k8s/*/deployment.yml` en consequence.

#### Etape 3 : Deploiement des services

```bash
# Deployer les services
kubectl apply -f k8s/auth/
kubectl apply -f k8s/order/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/breweries/

# Verifier le statut
kubectl get pods
kubectl get svc
```

#### Etape 4 : Configuration de l'Ingress

```bash
# Activer l'addon ingress
minikube addons enable ingress

# Verifier que l'ingress controller est pret
kubectl get pods -n ingress-nginx
```

#### Etape 5 : Configuration DNS locale

##### macOS / Linux

```bash
# Obtenir l'IP de Minikube
minikube ip
```

Editer le fichier hosts :

```bash
sudo nano /etc/hosts
```

Ajouter la ligne (remplacer par l'IP obtenue via `minikube ip`) :

```text
192.168.49.2 devops.local
```

##### Windows (PowerShell en mode administrateur)

```powershell
notepad C:\Windows\System32\drivers\etc\hosts
```

Ajouter la ligne :

```text
127.0.0.1 devops.local
```

#### Etape 6 : Deploiement de l'Ingress

```bash
# Deployer l'ingress
kubectl apply -f k8s/ingress/

# Verifier l'ingress
kubectl get ingress
```

#### Etape 7 : Demarrer le tunnel Minikube

Dans un terminal separe :

```bash
minikube tunnel
```

Ce tunnel permet a l'Ingress Controller d'avoir une IP accessible localement.

#### Etape 8 : Acces a l'application

Ouvrir le navigateur : <http://devops.local>

#### Etape 9 : Nettoyage

```bash
# Supprimer tous les deployments
kubectl delete -f k8s/

# Arreter minikube
minikube stop

# Supprimer le cluster (optionnel)
minikube delete
```

## Variables d'Environnement

### Frontend

Fichier : `frontend/.env.local` (developpement) ou `frontend/.env` (production)

```env
# URL de base du frontend
NEXT_PUBLIC_API_BASE=http://localhost:3000/api

# Services internes
AUTH_SERVICE_URL=http://localhost:8000
ORDER_SERVICE_URL=http://localhost:4000/orders
BREWERIES_SERVICE_URL=http://localhost:3001

# En Docker Compose / Kubernetes, remplacer par :
# AUTH_SERVICE_URL=http://auth-service:8000
# ORDER_SERVICE_URL=http://order-service:4000/orders
# BREWERIES_SERVICE_URL=http://breweries-service:3001
```

### Auth Service

Fichier : `auth-service/.env`

```env
# Secret JWT (partage entre tous les services)
JWT_SECRET=your-super-secret-key-change-in-production

# Configuration JWT
JWT_ALGO=HS256
ACCESS_TOKEN_EXPIRES_MIN=60
REFRESH_TOKEN_EXPIRES_MIN=43200

# CORS autorises
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:3001
```

### Breweries Service

Fichier : `breweries-service/.env`

```env
PORT=3001
JWT_SECRET=your-super-secret-key-change-in-production
DB_PATH=./breweries.db
NODE_ENV=production
```

### Order Service

Fichier : `order-service/.env`

```env
PORT=4000
JWT_SECRET=your-super-secret-key-change-in-production
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

Points importants :

- Le `JWT_SECRET` doit etre identique pour tous les services
- En Docker/Kubernetes, utiliser les noms de service au lieu de `localhost`
- Les bases de donnees SQLite persistent via volumes Docker
- Chaque service expose un endpoint `/health`

## Appels API Principaux

| Methode | Route | Authentification | Description |
|---------|-------|-----------------|-------------|
| POST | `/api/auth-login` | Non | Login utilisateur |
| POST | `/api/auth-logout` | Oui | Logout |
| POST | `/api/refresh` | Oui | Rafraichir token |
| GET | `/api/breweries` | Oui | Lister brasseries |
| GET | `/api/breweries?type=random` | Oui | Brasserie aleatoire |
| POST | `/api/favorites` | Oui | Ajouter aux favoris |
| DELETE | `/api/favorites/:id` | Oui | Retirer des favoris |
| GET | `/api/orders` | Oui | Lister commandes |
| POST | `/api/orders` | Oui | Creer commande |

## Technologies Utilisees

- Frontend : Next.js 16, React, TypeScript
- Auth Service : FastAPI, Python 3.9+
- Order Service : NestJS, TypeScript
- Breweries Service : Express, TypeScript
- Bases de donnees : SQLite, Prisma ORM
- Authentification : JWT
- Containerization : Docker, Docker Compose
- Orchestration : Kubernetes, Minikube
- API externe : OpenBreweryDB
