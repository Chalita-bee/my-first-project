import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, kibanaConfig, getElasticsearchAuth } from '../config/settings';
import { ELASTICSEARCH_FIELDS, CORRELATION_ID_FIELDS, DEFAULT_ENVIRONMENT, DEFAULT_PAGE_SIZE } from '../config/elasticsearchConstants';
import logger from './logger';

export interface LogQueryOptions {
  size?: number;
  env?: string;
  startTime?: string;
  endTime?: string;
}

export class KibanaClient {
  private client: Client | null = null;
  private readonly defaultEnv: string = DEFAULT_ENVIRONMENT;

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
   * Execute Elasticsearch search and extract results
   */
  private async executeSearch(index: string, query: any, size: number): Promise<any[]> {
    if (!this.client) {
      throw new Error('Client not connected');
    }
    const response = await this.client.search({ index, size, query });
    return (response.hits?.hits || []).map((hit: any) => hit._source);
  }

  /**
   * Build query with environment and time range filters
   */
  private buildQuery(baseQuery: any, options: LogQueryOptions = {}): any {
    const must: any[] = [baseQuery];
    must.push({ match: { [ELASTICSEARCH_FIELDS.ENVIRONMENT]: options.env || this.defaultEnv } });

    if (options.startTime && options.endTime) {
      must.push({
        range: {
          [ELASTICSEARCH_FIELDS.TIMESTAMP]: {
            gte: options.startTime,
            lte: options.endTime,
          },
        },
      });
    }

    return { bool: { must } };
  }

  async searchLogs(index: string, query: any, options: LogQueryOptions = {}): Promise<any[]> {
    try {
      const size = options.size || DEFAULT_PAGE_SIZE;
      const matchQuery = typeof query === 'string' ? { match_all: {} } : { match: query };
      const builtQuery = this.buildQuery(matchQuery, options);
      const hits = await this.executeSearch(index, builtQuery, size);
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
      const size = options.size || DEFAULT_PAGE_SIZE;
      const rangeQuery = {
        range: {
          [ELASTICSEARCH_FIELDS.TIMESTAMP]: { gte: startTime, lte: endTime },
        },
      };
      // Pass startTime/endTime to avoid double-filtering in buildQuery
      const builtQuery = this.buildQuery(rangeQuery, { ...options, startTime: undefined, endTime: undefined });
      const hits = await this.executeSearch(index, builtQuery, size);
      logger.debug(`Found ${hits.length} logs in time range`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by timestamp: ${error}`);
      throw error;
    }
  }

  /**
   * Query logs by field value with fallback to match query for compatibility
   */
  async getLogsByField(
    index: string,
    field: string,
    value: any,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    const size = options.size || DEFAULT_PAGE_SIZE;

    try {
      // Try term query first (exact match on keyword field)
      const fieldQuery = { term: { [`${field}.keyword`]: value } };
      const builtQuery = this.buildQuery(fieldQuery, options);
      const hits = await this.executeSearch(index, builtQuery, size);
      logger.debug(`Found ${hits.length} logs with ${field}=${value}`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by field: ${error}`);
      // Fallback to match query (some indices may not have .keyword mappings)
      try {
        logger.debug(`Retrying with match query for ${field}=${value}`);
        const matchQuery = { match: { [field]: value } };
        const builtQuery = this.buildQuery(matchQuery, options);
        const hits = await this.executeSearch(index, builtQuery, size);
        logger.debug(`Found ${hits.length} logs with match query ${field}=${value}`);
        return hits;
      } catch (fallbackError) {
        logger.error(`Fallback match query also failed: ${fallbackError}`);
        throw fallbackError;
      }
    }
  }

  /**
   * Query by correlation ID across multiple field variants
   */
  async getLogsByCorrelationId(
    index: string,
    correlationId: string,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    try {
      const size = options.size || DEFAULT_PAGE_SIZE;
      const shouldClauses = CORRELATION_ID_FIELDS.map(field => ({ match: { [field]: correlationId } }));
      const query = { bool: { should: shouldClauses, minimum_should_match: 1 } };
      const builtQuery = this.buildQuery(query, options);
      const hits = await this.executeSearch(index, builtQuery, size);
      logger.debug(`Found ${hits.length} logs with correlationId=${correlationId}`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by correlation ID: ${error}`);
      throw error;
    }
  }

  /**
   * Query with multiple field filters and environment/time range filtering
   */
  async getLogsByMultipleFields(
    index: string,
    filters: Record<string, any>,
    options: LogQueryOptions = {}
  ): Promise<any[]> {
    try {
      const size = options.size || DEFAULT_PAGE_SIZE;
      const must = Object.entries(filters).map(([field, value]) => ({ match: { [field]: value } }));
      const baseQuery = { bool: { must } };
      const builtQuery = this.buildQuery(baseQuery, options);
      const hits = await this.executeSearch(index, builtQuery, size);
      logger.debug(`Found ${hits.length} logs with multiple field filters`);
      return hits;
    } catch (error) {
      logger.error(`Error getting logs by multiple fields: ${error}`);
      throw error;
    }
  }
}

export default KibanaClient;
