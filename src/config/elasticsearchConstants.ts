/**
 * Elasticsearch field names and constants for Kibana integration
 */

export const ELASTICSEARCH_FIELDS = {
  TIMESTAMP: '@timestamp',
  ENVIRONMENT: 'env',
} as const;

export const CORRELATION_ID_FIELDS = [
  'correlationId',
  'requestUID',
  'X-Request-ID',
  'headers.requestUID',
  'headers.x-request-id',
] as const;

export const DEFAULT_ENVIRONMENT = 'alpha' as const;
export const DEFAULT_PAGE_SIZE = 10 as const;
