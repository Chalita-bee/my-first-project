from elasticsearch import Elasticsearch
from config.settings import ELASTICSEARCH_HOST, get_kibana_auth
from config.constants import LOG_INDEX_PATTERN
from utils.logger import get_logger

logger = get_logger(__name__)


class KibanaClient:
    def __init__(self):
        self.auth = get_kibana_auth()
        self.es_client = None

    def connect(self):
        """Establish Elasticsearch connection"""
        try:
            self.es_client = Elasticsearch([ELASTICSEARCH_HOST], basic_auth=self.auth)
            if self.es_client.ping():
                logger.info(f"Connected to Elasticsearch: {ELASTICSEARCH_HOST}")
            else:
                raise Exception("Failed to ping Elasticsearch")
        except Exception as e:
            logger.error(f"Failed to connect to Elasticsearch: {str(e)}")
            raise

    def disconnect(self):
        """Close Elasticsearch connection"""
        if self.es_client:
            self.es_client.close()
            logger.info("Disconnected from Elasticsearch")

    def search_logs(self, index, query, size=100):
        """Search logs in Kibana/Elasticsearch"""
        try:
            search_body = {
                "query": {
                    "bool": {
                        "must": [
                            {"match": query}
                        ]
                    }
                },
                "size": size
            }
            results = self.es_client.search(index=index, body=search_body)
            logger.debug(f"Found {len(results['hits']['hits'])} logs in index {index}")
            return results['hits']['hits']
        except Exception as e:
            logger.error(f"Error searching logs in {index}: {str(e)}")
            raise

    def get_logs_by_timestamp(self, index, start_time, end_time):
        """Get logs within a time range"""
        try:
            search_body = {
                "query": {
                    "range": {
                        "@timestamp": {
                            "gte": start_time,
                            "lte": end_time
                        }
                    }
                }
            }
            results = self.es_client.search(index=index, body=search_body)
            logger.debug(f"Found {len(results['hits']['hits'])} logs in time range")
            return results['hits']['hits']
        except Exception as e:
            logger.error(f"Error getting logs by timestamp: {str(e)}")
            raise

    def get_logs_by_field(self, index, field, value):
        """Get logs matching a specific field value"""
        try:
            search_body = {
                "query": {
                    "match": {
                        field: value
                    }
                }
            }
            results = self.es_client.search(index=index, body=search_body)
            logger.debug(f"Found {len(results['hits']['hits'])} logs with {field}={value}")
            return results['hits']['hits']
        except Exception as e:
            logger.error(f"Error getting logs by field: {str(e)}")
            raise
