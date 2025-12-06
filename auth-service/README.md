# Auth Service

Service d'authentification centralisé basé sur FastAPI et JWT.

**Port** : `8000` | **Framework** : FastAPI | **Langage** : Python 3.9+ | **BD** : SQLite

---

## 📁 Structure

```text
auth-service/
├── main.py          # Entry point FastAPI
├── auth.py          # Routes login/refresh
├── security.py      # JWT & password hashing
├── models.py        # Modèles SQLModel
├── db.py            # Configuration SQLite
├── jwks.py          # Routes clés publiques
├── init_db.py       # Initialisation DB
├── requirements.txt # Dépendances Python
├── Dockerfile       # Containerisation
├── .gitignore       # Fichiers ignorés Git
└── README.md        # Documentation
```

---

## 🚀 Lancement

### Local

```bash
cd auth-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Docs API : <http://localhost:8000/docs>

### Docker

```bash
docker build -t auth-service .
docker run -p 8000:8000 -e JWT_SECRET=your-secret-key auth-service
```

### Docker Compose / Kubernetes

```bash
docker-compose up -d auth-service
kubectl apply -f k8s/auth/
```

---

## 🔐 Configuration (`.env`)

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGO=HS256
ACCESS_TOKEN_EXPIRES_MIN=60
REFRESH_TOKEN_EXPIRES_MIN=43200
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,http://localhost:3001

# Docker Compose :
# CORS_ORIGINS=http://frontend:3000,http://order-service:4000,http://breweries-service:3001
```

⚠️ **Important** : `JWT_SECRET` doit être **identique** sur tous les services !

---

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/login` | Login avec username/password |
| POST | `/auth/refresh` | Rafraîchir le token |
| GET | `/.well-known/jwks.json` | Clés publiques pour validation |
| GET | `/health` | Health check |

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'
```

Réponse : JWT tokens (access_token + refresh_token)

---

## 📚 Documentation

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [JWT.io](https://jwt.io/)
- [Python-jose](https://python-jose.readthedocs.io/)

---

**Version** : 1.0
**Dernière mise à jour** : Décembre 2025
