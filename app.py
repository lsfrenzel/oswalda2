import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
migrate = Migrate()

# Create the app
app = Flask(__name__)

# Configure session secret
app.secret_key = os.environ.get("SESSION_SECRET")
if not app.secret_key:
    logging.warning("SESSION_SECRET not set - using development secret (NOT secure for production)")
    app.secret_key = "dev-secret-key-change-in-production"
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
database_url = os.environ.get("DATABASE_URL", "sqlite:///oswalda.db")

# Railway fix: PostgreSQL URLs starting with postgres:// need to be postgresql://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
    logging.info("Fixed PostgreSQL URL for SQLAlchemy compatibility")

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
    "connect_args": {
        "connect_timeout": 10
    }
}

# Email now handled by Resend API (see routes.py)
logging.info("Email configured via Resend API")

# Initialize extensions
db.init_app(app)

# Import models to ensure tables are created
import models  # noqa: F401

# Initialize Flask-Migrate (optional, for manual migrations via CLI)
migrate.init_app(app, db)

# Simple and fast database setup
with app.app_context():
    try:
        logging.info("Setting up database tables...")
        db.create_all()
        logging.info("Database tables ready")
    except Exception as e:
        logging.error(f"Error setting up database: {str(e)}")
        raise

# Import routes after app is configured to avoid circular imports
import routes  # noqa: F401
