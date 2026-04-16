import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, kibanaConfig, getElasticsearchAuth } from '../config/settings';
import logger from './logger';

export interface LogQueryOptions {
  size?: number;
  env?: string;
  startTime?: string;
  endTime?: string;
}

export class KibanaClient {
  private client: Client | null = null;
  private readonly defaultEnv: string = 'alpha'; // Default environment filter

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

  /**
   * Build query with environment filter and optional time range
   */
  private buildQuery(baseQuery: any, options: LogQueryOptions = {}): any {
    const must: any[] = [baseQuery];

    // Add environment filter (default to alpha)
    const env = options.env || this.defaultEnv;
    must.push({
      match: { env }
    });

    // Add time range filter if specified
    if (options.startTime && options.endTime) {
      must.push({
        range: {
          '@timestamp': {
            gte: options.startTime,
            lte: options.endTime,
          },
        },
      });
    }

    return {
      bool: {
        must,
      },
    };
  }

  async searchLogs(index: string, query: any, options: LogQueryOptions = {}): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const size = options.size || 100;
      const matchQuery = typeof query === 'string' ? { match_all: {} } : { match: query };
      const builtQuery = this.buildQuery(matchQuery, options);

      const response = await this.client.search({
        index,
        size,
        query: builtQuery,
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs in index ${index}`);
      return hits;
    } catch (error) {
      logger.error(`Error searching logs in ${index}: ${error}`);
      throw error;
    }
  }

  async getLogsByTimestamp(
    index: string,
    startTime: string,
    endTime: string,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const rangeQuery = {
        range: {
          '@timestamp': {
            gte: startTime,
            lte: endTime,
          },
        },
      };

      const builtQuery = this.buildQuery(rangeQuery, { ...options, startTime, endTime });

      const response = await this.client.search({
        index,
        size: options.size || 100,
        query: builtQuery,
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs in time range`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by timestamp: ${error}`);
      throw error;
    }
  }

  /**
   * Query logs by field value, supporting nested fields (e.g., headers.requestUID)
   */
  async getLogsByField(
    index: string,
    field: string,
    value: any,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const client = this.client;

      // Use term query for exact matches, match for text search
      const fieldQuery = {
        term: {
          [`${field}.keyword`]: value,
        },
      };

      const builtQuery = this.buildQuery(fieldQuery, options);

      const response = await client.search({
        index,
        size: options.size || 100,
        query: builtQuery,
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs with ${field}=${value}`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by field: ${error}`);
      // Fallback to match query if term query fails (for backward compatibility)
      try {
        if (!this.client) {
          throw new Error('Client not connected');
        }
        const client = this.client;
        logger.debug(`Retrying with match query for ${field}=${value}`);
        const matchQuery = {
          match: {
            [field]: value,
          },
        };
        const builtQuery = this.buildQuery(matchQuery, options);
        const response = await client.search({
          index,
          size: options.size || 100,
          query: builtQuery,
        });
        const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
        logger.debug(`Found ${hits.length} logs with match query ${field}=${value}`);
        return hits;
      } catch (fallbackError) {
        logger.error(`Fallback match query also failed: ${fallbackError}`);
        throw fallbackError;
      }
    }
  }

  /**
   * Query by correlation ID (supports correlationId, requestUID, x-request-id variants)
   */
  async getLogsByCorrelationId(
    index: string,
    correlationId: string,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const client = this.client;

      // Query logs matching any of the correlation ID fields
      const query = {
        bool: {
          should: [
            { match: { correlationId } },
            { match: { 'headers.requestUID': correlationId } },
            { match: { 'headers.x-request-id': correlationId } },
            { match: { requestUID: correlationId } },
            { match: { ['X-Request-ID']: correlationId } },
          ],
          minimum_should_match: 1,
        },
      };

      const builtQuery = {
        bool: {
          must: [
            query,
            { match: { env: options.env || this.defaultEnv } },
          ],
        },
      };

      const response = await client.search({
        index,
        size: options.size || 100,
        query: builtQuery,
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs with correlationId=${correlationId}`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by correlation ID: ${error}`);
      throw error;
    }
  }

  /**
   * Advanced query with multiple field filters
   */
  async getLogsByMultipleFields(
    index: string,
    filters: Record<string, any>,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    try {
      if (!this.client) {
        throw new Error('Client not connected');
      }

      const client = this.client;
      const must: any[] = [];

      // Build must clauses for each filter
      for (const [field, value] of Object.entries(filters)) {
        must.push({
          match: {
            [field]: value,
          },
        });
      }

      // Add environment filter
      must.push({
        match: { env: options.env || this.defaultEnv },
      });

      // Add time range if specified
      if (options.startTime && options.endTime) {
        must.push({
          range: {
            '@timestamp': {
              gte: options.startTime,
              lte: options.endTime,
            },
          },
        });
      }

      const response = await client.search({
        index,
        size: options.size || 100,
        query: {
          bool: {
            must,
          },
        },
      });

      const hits = (response.hits?.hits || []).map((hit: any) => hit._source);
      logger.debug(`Found ${hits.length} logs with multiple field filters`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by multiple fields: ${error}`);
      throw error;
    }
  }
}

export default KibanaClient;
