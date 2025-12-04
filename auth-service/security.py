"""
Module de gestion de la sécurité applicative :
- Hashage des mots de passe (bcrypt via Passlib)
- Vérification des mots de passe
- Création de tokens JWT (access + refresh)
- Décodage et vérification des tokens JWT
"""

from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------
# 🔐 Configuration sécurité (variables d'environnement)
# ---------------------------------------------------------------------

# Clé secrète pour signer les JWT (HS256)
# En production : clé longue, aléatoire, jamais committée.
SECRET_KEY = os.getenv("JWT_SECRET")

# Algorithme cryptographique utilisé pour signer les tokens.
# Typiquement HS256 (symétrique) ou RS256 (asymétrique si clés RSA).
ALGORITHM = os.getenv("JWT_ALGO")

# Durée d’expiration des tokens (en minutes)
ACCESS_EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRES_MIN"))
REFRESH_EXPIRE_MIN = int(os.getenv("REFRESH_TOKEN_EXPIRES_MIN"))


# ---------------------------------------------------------------------
# 🔒 Contexte Passlib : hashage bcrypt
# ---------------------------------------------------------------------

# bcrypt est la recommandation standard pour les mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Retourne un hash sécurisée (bcrypt) du mot de passe en clair.
    Aucune conservation du mot de passe en clair en base.
    """
    return pwd_context.hash(password)


def verify_password(password: str, hash_: str) -> bool:
    """
    Vérifie qu'un mot de passe correspond à son hash.
    Passlib gère automatiquement le salage et les paramètres bcrypt.
    """
    return pwd_context.verify(password, hash_)


# ---------------------------------------------------------------------
# 🔑 JWT : création + décodage
# ---------------------------------------------------------------------


def create_token(sub: str, refresh: bool = False) -> str:
    """
    Génère un JWT signé contenant :
    - sub : identifiant du sujet (ex. username)
    - exp : date d’expiration
    - type : 'access' ou 'refresh'

    Les durées d'expiration sont configurées via les variables .env.
    """
    expire = datetime.utcnow() + timedelta(
        minutes=REFRESH_EXPIRE_MIN if refresh else ACCESS_EXPIRE_MIN
    )

    payload = {"sub": sub, "exp": expire, "type": "refresh" if refresh else "access"}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Décode un JWT signé :
    - Vérifie la signature et l'expiration
    - Retourne le payload décodé
    - Lève jwt.ExpiredSignatureError ou jwt.InvalidTokenError en cas d’erreur
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
