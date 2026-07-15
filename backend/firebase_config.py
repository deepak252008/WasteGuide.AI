import os
import logging
import firebase_admin
from firebase_admin import credentials, firestore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = None
FIREBASE_ENABLED = False

# Load credentials from path specified in env, default to serviceAccountKey.json in the backend directory
service_account_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")

if service_account_path and not os.path.isabs(service_account_path):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    service_account_path = os.path.join(base_dir, service_account_path)

if os.path.exists(service_account_path):
    try:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        FIREBASE_ENABLED = True
        logger.info("Firebase Admin SDK initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing Firebase: {e}")
        logger.info("Running in DEMO MODE (In-memory storage).")
else:
    logger.warning(f"Firebase service account file not found at: {service_account_path}")
    logger.info("Running in DEMO MODE (In-memory storage).")
