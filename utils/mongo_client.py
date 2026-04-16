from pymongo import MongoClient
from config.settings import MONGO_HOST, MONGO_PORT, MONGO_DATABASE, get_mongo_connection_string
from utils.logger import get_logger

logger = get_logger(__name__)


class MongoDBClient:
    def __init__(self):
        self.connection_string = get_mongo_connection_string()
        self.client = None
        self.db = None

    def connect(self):
        """Establish MongoDB connection"""
        try:
            self.client = MongoClient(self.connection_string)
            self.db = self.client[MONGO_DATABASE]
            logger.info(f"Connected to MongoDB: {MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    def disconnect(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")

    def find_one(self, collection_name, query):
        """Find a single document"""
        try:
            collection = self.db[collection_name]
            result = collection.find_one(query)
            logger.debug(f"Found document in {collection_name}: {result}")
            return result
        except Exception as e:
            logger.error(f"Error finding document in {collection_name}: {str(e)}")
            raise

    def find_many(self, collection_name, query=None):
        """Find multiple documents"""
        try:
            collection = self.db[collection_name]
            results = list(collection.find(query or {}))
            logger.debug(f"Found {len(results)} documents in {collection_name}")
            return results
        except Exception as e:
            logger.error(f"Error finding documents in {collection_name}: {str(e)}")
            raise

    def insert_one(self, collection_name, document):
        """Insert a single document"""
        try:
            collection = self.db[collection_name]
            result = collection.insert_one(document)
            logger.debug(f"Inserted document in {collection_name} with ID: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            logger.error(f"Error inserting document in {collection_name}: {str(e)}")
            raise

    def update_one(self, collection_name, query, update):
        """Update a single document"""
        try:
            collection = self.db[collection_name]
            result = collection.update_one(query, {"$set": update})
            logger.debug(f"Updated {result.modified_count} document(s) in {collection_name}")
            return result.modified_count
        except Exception as e:
            logger.error(f"Error updating document in {collection_name}: {str(e)}")
            raise

    def delete_one(self, collection_name, query):
        """Delete a single document"""
        try:
            collection = self.db[collection_name]
            result = collection.delete_one(query)
            logger.debug(f"Deleted {result.deleted_count} document(s) in {collection_name}")
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error deleting document in {collection_name}: {str(e)}")
            raise
