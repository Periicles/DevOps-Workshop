# Frontend

Interface utilisateur Next.js pour le système de gestion des brasseries et commandes.

**Port** : `3000` | **Framework** : Next.js 16 | **Langage** : TypeScript | **Styles** : Tailwind CSS

---

## 📁 Structure

```text
frontend/
├── app/
│   ├── page.tsx                    # Page d'accueil
│   ├── layout.tsx                  # Layout global
│   ├── globals.css                 # Styles globaux
│   ├── favicon.ico                 # Icône
│   ├── api/                        # Routes API (proxy backend)
│   │   ├── auth-login/route.ts
│   │   ├── breweries/route.ts
│   │   ├── favorites/route.ts
│   │   ├── health/route.ts
│   │   ├── logout/route.ts
│   │   ├── orders/route.ts
│   │   └── refresh/route.ts
│   ├── breweries/                  # Pages brasseries
│   │   ├── page.tsx
│   │   ├── countries/page.tsx
│   │   └── favoris/page.tsx
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard utilisateur
│   └── components/
│       └── Navbar.tsx              # Navigation
├── lib/
│   ├── api.ts                      # Client HTTP
│   └── auth.ts                     # Helpers JWT
├── public/                         # Assets statiques
├── next.config.ts
├── next-env.d.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── eslint.config.mjs
├── proxy.ts
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Lancement

### Local

```bash
cd frontend
npm install
npm run dev
```

Application : <http://localhost:3000>

### Docker

```bash
docker build -t frontend .
docker run -p 3000:3000 frontend
```

### Docker Compose / Kubernetes

```bash
docker-compose up -d frontend
kubectl apply -f k8s/frontend/
```

---

## 🔐 Configuration (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:8000
ORDER_SERVICE_URL=http://localhost:4000
BREWERIES_SERVICE_URL=http://localhost:3001

# Docker Compose :
# AUTH_SERVICE_URL=http://auth-service:8000
# ORDER_SERVICE_URL=http://order-service:4000
# BREWERIES_SERVICE_URL=http://breweries-service:3001
```

⚠️ **Important** : Les routes `/app/api/*` font office de **proxy** vers les backend services !

---

## 📡 Routes Principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil / login |
| `/dashboard` | Dashboard utilisateur |
| `/breweries` | Liste des brasseries |
| `/breweries/favoris` | Favoris utilisateur |
| `/breweries/countries` | Brasseries par pays |

### API Routes (Proxy Backend)

| Endpoint | Cible | Description |
|----------|-------|-------------|
| `/api/auth-login` | auth-service | Authentification |
| `/api/breweries` | breweries-service | Liste brasseries |
| `/api/favorites` | breweries-service | Gestion favoris |
| `/api/orders` | order-service | Gestion commandes |
| `/api/health` | Tous | Health checks |

---

## 🛠️ Troubleshooting

| Problème | Solution |
|----------|----------|
| Port 3000 in use | Changer port : `npm run dev -- -p 3001` |
| Erreurs CORS | Vérifier `.env.local` et services backend |
| 404 sur `/api/*` | Vérifier que les services backend sont démarrés |
| Cookies non définis | Vérifier `httpOnly` et `sameSite` dans route.ts |

---

## 📚 Documentation

- [Next.js 16 Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Version** : 1.0
**Dernière mise à jour** : Décembre 2025
