import pytest
from utils.api_client import APIClient
from utils.mongo_client import MongoDBClient
from utils.kibana_client import KibanaClient
from utils.playwright_helper import PlaywrightHelper


@pytest.fixture(scope="session")
def api_client():
    """Fixture for API client"""
    client = APIClient()
    yield client
    client.close()


@pytest.fixture(scope="session")
def mongo_client():
    """Fixture for MongoDB client"""
    client = MongoDBClient()
    client.connect()
    yield client
    client.disconnect()


@pytest.fixture(scope="session")
def kibana_client():
    """Fixture for Kibana/Elasticsearch client"""
    client = KibanaClient()
    try:
        client.connect()
        yield client
    except Exception:
        yield client
    finally:
        client.disconnect()


@pytest.fixture(scope="function")
def browser():
    """Fixture for Playwright browser"""
    helper = PlaywrightHelper()
    page = helper.start()
    yield page
    helper.stop()


@pytest.fixture(autouse=True)
def log_test_info(request):
    """Automatically log test information"""
    print(f"\n{'='*50}")
    print(f"Test: {request.node.name}")
    print(f"{'='*50}")
    yield
    print(f"Test completed: {request.node.name}")
