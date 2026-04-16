# Kibana Configuration Guide

## Overview

This document explains how to configure and use the enhanced Kibana integration in the Bill Payment API Testing framework. The KibanaClient now supports advanced querying features including correlation ID searches, environment filtering, and multi-field queries.

## Kibana Setup

### Environment Configuration

Configure your `.env` file with the following Kibana/Elasticsearch settings:

```env
# Elasticsearch/Kibana Configuration
ELASTICSEARCH_HOST=https://scb-mandatory-logging-np-es.np.private.azscb.tech
KIBANA_HOST=https://scb-mandatory-logging-np-kb.np.private.azscb.tech
KIBANA_SPACE=scb-payment-domain-cloud
KIBANA_INDEX_PATTERN=logs-bill-payment-*
KIBANA_USERNAME=your_username
KIBANA_PASSWORD=your_password
```

### Kibana Data View Configuration

The framework uses the following Kibana configuration:
- **Space**: `scb-payment-domain-cloud`
- **Data View ID**: `a48c0a18-d77f-4ea2-9017-f364ae8a5717` (for reference)
- **Index Pattern**: `logs-bill-payment-*`
- **Default Environment Filter**: `env:alpha`

### Kibana URL Example

Access your Kibana instance at:
```
https://scb-mandatory-logging-np-kb.np.private.azscb.tech/s/scb-payment-domain-cloud/app/discover
```

## Enhanced KibanaClient Features

### 1. Correlation ID Search

Search logs using any of the correlation ID field variants (requestUID, X-Request-ID, correlationId):

```typescript
import KibanaClient from '../src/utils/kibanaClient';
import { INDICES } from '../src/config/constants';

const kibanaClient = new KibanaClient();
await kibanaClient.connect();

// Search by correlation ID (automatically searches all ID field variants)
const logs = await kibanaClient.getLogsByCorrelationId(
  INDICES.BILL_PAYMENT,
  'BE69041607114c8adb0e42',
  { env: 'alpha' } // Filter by environment
);

console.log(`Found ${logs.length} logs`);
```

**Supported ID Fields**:
- `correlationId`
- `headers.requestUID`
- `headers.x-request-id`
- `requestUID`
- `X-Request-ID`

### 2. Field-Based Queries

Query logs by specific field values with support for nested fields:

```typescript
// Query with exact field match
const logs = await kibanaClient.getLogsByField(
  INDICES.BILL_PAYMENT,
  'headers.x-request-id',
  'BE69041607114c8adb0e42',
  { env: 'alpha', size: 50 }
);
```

### 3. Timestamp-Based Queries

Query logs within a specific time range:

```typescript
const endTime = new Date().toISOString();
const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

const logs = await kibanaClient.getLogsByTimestamp(
  INDICES.BILL_PAYMENT,
  startTime,
  endTime,
  { env: 'alpha' }
);
```

### 4. Multi-Field Queries

Advanced queries with multiple field filters:

```typescript
const logs = await kibanaClient.getLogsByMultipleFields(
  INDICES.BILL_PAYMENT,
  {
    'headers.x-request-id': 'BE69041607114c8adb0e42',
    'httpStatusCode': 200,
    'uri': '/v1/proxy-gateway/payment/teller/InqPayment'
  },
  { env: 'alpha' }
);
```

### 5. General Log Search

Search logs with custom queries:

```typescript
const logs = await kibanaClient.searchLogs(
  INDICES.BILL_PAYMENT,
  { message: 'payment_processed' },
  { env: 'alpha', size: 100 }
);
```

## Query Options Interface

All KibanaClient methods accept optional `LogQueryOptions`:

```typescript
interface LogQueryOptions {
  size?: number;        // Number of results to return (default: 100)
  env?: string;         // Environment filter (default: 'alpha')
  startTime?: string;   // Start timestamp (ISO 8601)
  endTime?: string;     // End timestamp (ISO 8601)
}
```

## Integration Test Example

### Payment Inquiry with Kibana Validation

```typescript
test('should validate payment inquiry with Kibana logs', async () => {
  const payload = InqPaymentPayloads.inqPaymentPayload();
  const headers = InqPaymentPayloads.getHeaders();
  const requestId = headers['X-Request-ID'];

  let kibanaClient: KibanaClient | null = null;

  try {
    // Call API
    const response = await apiClient.post(
      '/v1/proxy-gateway/payment/teller/InqPayment',
      payload,
      { headers }
    );

    ResponseValidator.assertStatusCode(response, HTTP_STATUS.OK);

    // Validate Kibana logs
    kibanaClient = new KibanaClient();
    await kibanaClient.connect();

    const logs = await kibanaClient.getLogsByCorrelationId(
      INDICES.BILL_PAYMENT,
      requestId,
      { env: 'alpha' }
    );

    if (logs.length > 0) {
      LogValidator.assertLogExists(logs, requestId);
      console.log(`Found ${logs.length} log entries`);
    }
  } finally {
    if (kibanaClient) await kibanaClient.disconnect();
  }
});
```

## Log Field References

The framework monitors these key fields in Kibana logs:

| Field | Description | Example |
|-------|-------------|---------|
| `correlationId` | Transaction correlation ID | `BE69041607114c8adb0e42` |
| `headers.x-request-id` | HTTP request ID header | `BE69041607114c8adb0e42` |
| `headers.requestUID` | Request UID header | `BE69041607114c8adb0e42` |
| `httpStatusCode` | HTTP response status | `200`, `201`, `400` |
| `uri` | Request URI/endpoint | `/v1/proxy-gateway/payment/teller/InqPayment` |
| `requestBody` | Full request payload | JSON object |
| `responseBody` | Full response payload | JSON object |
| `env` | Environment name | `alpha`, `beta`, `prod` |
| `@timestamp` | Log timestamp | `2024-04-16T12:30:45.123Z` |

## Troubleshooting

### Elasticsearch Connection Failed

```bash
# Verify Elasticsearch is accessible
curl -u username:password https://scb-mandatory-logging-np-es.np.private.azscb.tech

# Check environment variables
echo $ELASTICSEARCH_HOST
echo $KIBANA_HOST
```

### No Logs Found

1. **Check environment filter**: Verify you're querying the correct environment (default: `alpha`)
2. **Verify timestamp**: Ensure API calls happened within the queried time range
3. **Check correlation ID**: Ensure the correlation ID matches what was used in the API call
4. **Verify index pattern**: Confirm logs are in `logs-bill-payment-*` index

Example debug query:

```typescript
// Query without environment filter
const allLogs = await kibanaClient.searchLogs(
  INDICES.BILL_PAYMENT,
  { message: 'any' },
  { size: 10, env: '' } // Empty env to get all
);
console.log('Available logs:', allLogs);
```

### Nested Field Not Found

Some fields might not have `.keyword` variants. Use the fallback match query:

```typescript
// KibanaClient automatically tries both term and match queries
const logs = await kibanaClient.getLogsByField(
  INDICES.BILL_PAYMENT,
  'nested.field.name',
  'value'
);
```

## Best Practices

1. **Always use correlation IDs**: Use `getLogsByCorrelationId()` for reliable log matching
2. **Include environment filter**: Specify `env: 'alpha'` or appropriate environment
3. **Use reasonable time ranges**: For better performance, limit query time ranges
4. **Handle connection gracefully**: Always disconnect in finally blocks
5. **Add timeouts**: Set appropriate Jest timeouts (minimum 15 seconds for Kibana queries):

```typescript
test('should query Kibana logs', async () => {
  // test implementation
}, 15000); // 15 second timeout
```

## Authentication

The KibanaClient uses Elasticsearch authentication from `.env`:

```typescript
// From settings.ts
const auth = getElasticsearchAuth();
// Returns: { username: string, password: string } | undefined
```

Credentials are loaded from:
- `KIBANA_USERNAME`
- `KIBANA_PASSWORD`

## Performance Tips

1. **Limit result size**: Use `size: 10` for faster queries when possible
2. **Narrow time ranges**: Reduce query time range to specific windows
3. **Use exact matches**: Prefer `term` queries over `match` queries for performance
4. **Index management**: Archive old logs to keep index size manageable

## Related Files

- Configuration: `src/config/settings.ts`
- Client Implementation: `src/utils/kibanaClient.ts`
- Test Example: `tests/api/billPayment.test.ts`
- Log Validation: `tests/logs/kibanaValidation.test.ts`
- Constants: `src/config/constants.ts`

## Additional Resources

- [Elasticsearch Query DSL Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- [Kibana Discover Guide](https://www.elastic.co/guide/en/kibana/current/discover.html)
- [Node.js Elasticsearch Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
