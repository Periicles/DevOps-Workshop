from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv

load_dotenv(override=True)

# URL de la base SQLite (modifiable via .env)
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Using database URL: {DATABASE_URL}")

# Moteur SQLAlchemy/SQLModel
engine = create_engine(DATABASE_URL, echo=False)


def init_db():
    """
    Création des tables au démarrage de l'application.
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Injection de dépendance FastAPI.
    Fournit une session SQLModel dans un contexte 'with', garantissant
    l'ouverture et la fermeture propres de la connexion.
    """
    with Session(engine) as session:
        yield session
