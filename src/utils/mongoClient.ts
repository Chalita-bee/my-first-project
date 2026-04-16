import { MongoClient, Db, Collection } from 'mongodb';
import { mongoConfig, getMongoConnectionString } from '../config/settings';
import logger from './logger';

export class MongoDBClient {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connectionString: string;

  constructor() {
    this.connectionString = getMongoConnectionString();
  }

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db(mongoConfig.database);
      logger.info(`Connected to MongoDB: ${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`);
    } catch (error) {
      logger.error(`Failed to connect to MongoDB: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      logger.info('Disconnected from MongoDB');
    }
  }

  private getCollection(collectionName: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(collectionName);
  }

  async findOne<T = any>(collectionName: string, query: any): Promise<T | null> {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.findOne<T>(query);
      logger.debug(`Found document in ${collectionName}: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`Error finding document in ${collectionName}: ${error}`);
      throw error;
    }
  }

  async findMany<T = any>(collectionName: string, query: any = {}): Promise<T[]> {
    try {
      const collection = this.getCollection(collectionName);
      const results = await collection.find(query).toArray();
      logger.debug(`Found ${results.length} documents in ${collectionName}`);
      return results as T[];
    } catch (error) {
      logger.error(`Error finding documents in ${collectionName}: ${error}`);
      throw error;
    }
  }

  async insertOne(collectionName: string, document: any): Promise<string> {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.insertOne(document);
      logger.debug(`Inserted document in ${collectionName} with ID: ${result.insertedId}`);
      return result.insertedId.toString();
    } catch (error) {
      logger.error(`Error inserting document in ${collectionName}: ${error}`);
      throw error;
    }
  }

  async updateOne(collectionName: string, query: any, update: any): Promise<number> {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.updateOne(query, { $set: update });
      logger.debug(`Updated ${result.modifiedCount} document(s) in ${collectionName}`);
      return result.modifiedCount;
    } catch (error) {
      logger.error(`Error updating document in ${collectionName}: ${error}`);
      throw error;
    }
  }

  async deleteOne(collectionName: string, query: any): Promise<number> {
    try {
      const collection = this.getCollection(collectionName);
      const result = await collection.deleteOne(query);
      logger.debug(`Deleted ${result.deletedCount} document(s) in ${collectionName}`);
      return result.deletedCount || 0;
    } catch (error) {
      logger.error(`Error deleting document in ${collectionName}: ${error}`);
      throw error;
    }
  }
}

export default MongoDBClient;
