import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_migrate import Migrate
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
mail = Mail()
migrate = Migrate()

# Create the app
app = Flask(__name__)

# Require SESSION_SECRET from environment
if not os.environ.get("SESSION_SECRET"):
    raise RuntimeError("SESSION_SECRET environment variable must be set")
app.secret_key = os.environ.get("SESSION_SECRET")
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

# Configure Flask-Mail with validation
mail_username = os.environ.get('MAIL_USERNAME')
mail_password = os.environ.get('MAIL_PASSWORD')

if not mail_username or not mail_password:
    raise RuntimeError("MAIL_USERNAME and MAIL_PASSWORD environment variables must be set")

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', '587'))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
app.config['MAIL_USERNAME'] = mail_username
app.config['MAIL_PASSWORD'] = mail_password
app.config['MAIL_DEFAULT_SENDER'] = mail_username
app.config['MAIL_RECIPIENT'] = os.environ.get('MAIL_RECIPIENT', 'suportemensagemcliente@gmail.com')

# Initialize extensions
db.init_app(app)
mail.init_app(app)

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
