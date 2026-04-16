// Test Data Constants
export const TEST_DATA = {
  DEFAULT_USER_ID: 'user_001',
  DEFAULT_BILL_AMOUNT: 1000.00,
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_BILL_DESCRIPTION: 'Test Bill Payment',
};

// API Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Default Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// MongoDB Collections
export const COLLECTIONS = {
  BILLS: 'bills',
  PAYMENTS: 'payments',
  TRANSACTIONS: 'transactions',
};

// Kibana/Elasticsearch Indices
export const INDICES = {
  LOG_PATTERN: 'logs-*',
  BILL_PAYMENT: 'logs-bill-payment-*',
};

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  API_RESPONSE: 10000,
  DB_QUERY: 5000,
  LOG_QUERY: 10000,
};

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
};
