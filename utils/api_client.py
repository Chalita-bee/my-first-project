import requests
from config.settings import API_BASE_URL, API_TIMEOUT
from config.constants import DEFAULT_HEADERS
from utils.logger import get_logger

logger = get_logger(__name__)


class APIClient:
    def __init__(self, base_url=API_BASE_URL, timeout=API_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)

    def get(self, endpoint, **kwargs):
        """Make GET request"""
        url = f"{self.base_url}{endpoint}"
        logger.info(f"GET {url}")
        try:
            response = self.session.get(url, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            logger.info(f"Response Status: {response.status_code}")
            return response
        except requests.RequestException as e:
            logger.error(f"GET request failed: {str(e)}")
            raise

    def post(self, endpoint, json=None, **kwargs):
        """Make POST request"""
        url = f"{self.base_url}{endpoint}"
        logger.info(f"POST {url}")
        logger.debug(f"Payload: {json}")
        try:
            response = self.session.post(url, json=json, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            logger.info(f"Response Status: {response.status_code}")
            return response
        except requests.RequestException as e:
            logger.error(f"POST request failed: {str(e)}")
            raise

    def put(self, endpoint, json=None, **kwargs):
        """Make PUT request"""
        url = f"{self.base_url}{endpoint}"
        logger.info(f"PUT {url}")
        logger.debug(f"Payload: {json}")
        try:
            response = self.session.put(url, json=json, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            logger.info(f"Response Status: {response.status_code}")
            return response
        except requests.RequestException as e:
            logger.error(f"PUT request failed: {str(e)}")
            raise

    def delete(self, endpoint, **kwargs):
        """Make DELETE request"""
        url = f"{self.base_url}{endpoint}"
        logger.info(f"DELETE {url}")
        try:
            response = self.session.delete(url, timeout=self.timeout, **kwargs)
            response.raise_for_status()
            logger.info(f"Response Status: {response.status_code}")
            return response
        except requests.RequestException as e:
            logger.error(f"DELETE request failed: {str(e)}")
            raise

    def close(self):
        """Close session"""
        self.session.close()
