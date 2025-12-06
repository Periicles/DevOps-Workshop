# Order Service

Service de gestion des commandes utilisateur basé sur NestJS et Prisma ORM.

**Port** : `4000` | **Framework** : NestJS | **Langage** : TypeScript | **BD** : SQLite (Prisma)

---

## 📁 Structure

```text
order-service/
├── src/
│   ├── main.ts                     # Entry point NestJS
│   ├── app.module.ts               # Module principal
│   ├── app.controller.ts           # Controller principal
│   ├── app.controller.spec.ts      # Tests controller
│   ├── app.service.ts              # Service principal
│   ├── health.controller.ts        # Health check
│   ├── auth/
│   │   ├── jwt-auth.guard.ts       # Guard JWT
│   │   └── user.decorator.ts       # Décorateur utilisateur
│   └── orders/
│       ├── orders.module.ts
│       ├── orders.controller.ts    # Routes /orders
│       ├── orders.controller.spec.ts
│       ├── orders.service.ts       # Logique métier
│       ├── orders.service.spec.ts
│       └── dto/
│           └── create-order.dto.ts
├── prisma/
│   ├── schema.prisma               # Schéma DB Prisma
│   ├── prisma.service.ts           # Service Prisma
│   └── migrations/                 # Historique migrations
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── package-lock.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.mjs
├── prisma.config.ts
├── .prettierrc
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Lancement

### Local

```bash
cd order-service
npm install
npx prisma migrate dev
npm run start:dev
```

API : <http://localhost:4000>

### Docker

```bash
docker build -t order-service .
docker run -p 4000:4000 -e JWT_SECRET=your-secret-key order-service
```

### Docker Compose / Kubernetes

```bash
docker-compose up -d order-service
kubectl apply -f k8s/order/
```

---

## 🔐 Configuration (`.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-key-change-in-production
PORT=4000
```

⚠️ **Important** : `JWT_SECRET` doit être **identique** à celui de l'auth-service !

---

## 📡 API Endpoints

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/orders` | Créer une commande | ✅ |
| GET | `/orders` | Liste des commandes utilisateur | ✅ |
| GET | `/orders/:id` | Détails d'une commande | ✅ |
| PATCH | `/orders/:id` | Modifier une commande | ✅ |
| DELETE | `/orders/:id` | Supprimer une commande | ✅ |
| GET | `/health` | Health check | ❌ |

### Créer une commande

```bash
curl -X POST http://localhost:4000/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"breweryId":"abc123","quantity":2,"totalPrice":25.50}'
```

---

## 🛠️ Troubleshooting

| Problème | Solution |
|----------|----------|
| Port 4000 in use | Changer `PORT` dans `.env` |
| JWT validation failed | Vérifier `JWT_SECRET` identique à auth-service |
| Prisma migration error | `npx prisma migrate reset` puis `npx prisma migrate dev` |
| Database locked | Redémarrer le service |

---

## 📚 Documentation

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

---

**Version** : 1.0  
**Dernière mise à jour** : Décembre 2025
