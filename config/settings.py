import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8080")
API_TIMEOUT = int(os.getenv("API_TIMEOUT", "30"))

# MongoDB Configuration
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
MONGO_DATABASE = os.getenv("MONGO_DATABASE", "bill_payment")
MONGO_USERNAME = os.getenv("MONGO_USERNAME", "")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "")

# Kibana Configuration
KIBANA_HOST = os.getenv("KIBANA_HOST", "http://localhost:5601")
KIBANA_USERNAME = os.getenv("KIBANA_USERNAME", "")
KIBANA_PASSWORD = os.getenv("KIBANA_PASSWORD", "")
ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST", "http://localhost:9200")

# Browser Configuration
HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
SLOW_MO = int(os.getenv("SLOW_MO", "100"))
BROWSER_TYPE = os.getenv("BROWSER_TYPE", "chromium")

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


def get_mongo_connection_string():
    """Generate MongoDB connection string from config"""
    if MONGO_USERNAME and MONGO_PASSWORD:
        return f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}"
    return f"mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}"


def get_kibana_auth():
    """Return Kibana authentication tuple"""
    if KIBANA_USERNAME and KIBANA_PASSWORD:
        return (KIBANA_USERNAME, KIBANA_PASSWORD)
    return None
