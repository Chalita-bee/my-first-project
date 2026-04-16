import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, kibanaConfig, getElasticsearchAuth } from '../config/settings';
import logger from './logger';

export class KibanaClient {
  private client: Client | null = null;

  async connect(): Promise<void> {
    try {
      const auth = getElasticsearchAuth();
      this.client = new Client({
        node: elasticsearchConfig.host,
        ...(auth && { auth }),
      });

      await this.client.ping();
      logger.info(`Connected to Elasticsearch: ${elasticsearchConfig.host}`);
    } catch (error) {
      logger.error(`Failed to connect to Elasticsearch: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      logger.info('Disconnected from Elasticsearch');
    }
  }

  async searchLogs(index: string, query: any, size: number = 100): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const response = await this.client.search({
        index,
        size,
        query: {
          bool: {
            must: [{ match: query }],
          },
        },
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs in index ${index}`);
      return hits;
    } catch (error) {
      logger.error(`Error searching logs in ${index}: ${error}`);
      throw error;
    }
  }

  async getLogsByTimestamp(index: string, startTime: string, endTime: string): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const response = await this.client.search({
        index,
        query: {
          range: {
            '@timestamp': {
              gte: startTime,
              lte: endTime,
            },
          },
        },
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs in time range`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by timestamp: ${error}`);
      throw error;
    }
  }

  async getLogsByField(index: string, field: string, value: any): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const response = await this.client.search({
        index,
        query: {
          match: {
            [field]: value,
          },
        },
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs with ${field}=${value}`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by field: ${error}`);
      throw error;
    }
  }
}

export default KibanaClient;
