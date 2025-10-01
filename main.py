import os
from app import app

# Export app for gunicorn
__all__ = ['app']

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
