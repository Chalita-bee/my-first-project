# Kibana Integration - Quick Start Guide

## Setup (5 minutes)

### 1. Configure Environment Variables

Create or update `.env` file:

```env
# Elasticsearch/Kibana Configuration
ELASTICSEARCH_HOST=https://scb-mandatory-logging-np-es.np.private.azscb.tech
KIBANA_HOST=https://scb-mandatory-logging-np-kb.np.private.azscb.tech
KIBANA_SPACE=scb-payment-domain-cloud
KIBANA_INDEX_PATTERN=logs-bill-payment-*
KIBANA_USERNAME=your_username
KIBANA_PASSWORD=your_password
```

### 2. Compile & Install

```bash
npm install
npm run build
```

## Common Tasks

### Query by Correlation ID

```typescript
import KibanaClient from './src/utils/kibanaClient';
import { INDICES } from './src/config/constants';

const client = new KibanaClient();
await client.connect();

const logs = await client.getLogsByCorrelationId(
  INDICES.BILL_PAYMENT,
  'BE69041607114c8adb0e42',  // Your Request ID
  { env: 'alpha' }
);

console.log(`Found ${logs.length} logs`);
await client.disconnect();
```

### Query by Field

```typescript
const logs = await client.getLogsByField(
  INDICES.BILL_PAYMENT,
  'headers.x-request-id',
  'BE69041607114c8adb0e42',
  { env: 'alpha' }
);
```

### Query by Timestamp

```typescript
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

const logs = await client.getLogsByTimestamp(
  INDICES.BILL_PAYMENT,
  oneHourAgo.toISOString(),
  now.toISOString(),
  { env: 'alpha' }
);
```

### Complex Multi-Field Query

```typescript
const logs = await client.getLogsByMultipleFields(
  INDICES.BILL_PAYMENT,
  {
    'headers.x-request-id': 'BE69041607114c8adb0e42',
    'httpStatusCode': 200,
    'uri': '/v1/proxy-gateway/payment/teller/InqPayment'
  },
  { env: 'alpha', size: 50 }
);
```

## Run Integration Tests

```bash
# Run all tests
npm test

# Run API tests with Kibana validation
npm run test:api

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Supported ID Fields

The `getLogsByCorrelationId()` method automatically searches:
- `correlationId`
- `headers.requestUID`
- `headers.x-request-id`
- `requestUID`
- `X-Request-ID`

This means you can pass any of these values and find the logs.

## Query Options

All query methods accept options:

```typescript
interface LogQueryOptions {
  size?: number;        // Results limit (default: 100)
  env?: string;         // Filter by environment (default: 'alpha')
  startTime?: string;   // ISO 8601 timestamp
  endTime?: string;     // ISO 8601 timestamp
}
```

## Test Timeout

Kibana queries can be slow. Set appropriate Jest timeout:

```typescript
test('my test', async () => {
  // test implementation
}, 15000); // 15 second timeout
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Check ELASTICSEARCH_HOST in .env |
| Authentication failed | Verify KIBANA_USERNAME and KIBANA_PASSWORD |
| No logs found | Check env value (default: 'alpha'), verify API was called |
| Timeout errors | Increase Jest timeout, try smaller time range |
| TypeScript errors | Run `npm install` and `npm run build` |

## Example: Payment Inquiry Test

```typescript
test('should validate payment inquiry with Kibana logs', async () => {
  const payload = InqPaymentPayloads.inqPaymentPayload();
  const headers = InqPaymentPayloads.getHeaders();
  const requestId = headers['X-Request-ID'];

  // Step 1: Call API
  const response = await apiClient.post(
    '/v1/proxy-gateway/payment/teller/InqPayment',
    payload,
    { headers }
  );
  expect(response.status).toBe(200);

  // Step 2: Validate Kibana logs
  const kibanaClient = new KibanaClient();
  await kibanaClient.connect();

  const logs = await kibanaClient.getLogsByCorrelationId(
    INDICES.BILL_PAYMENT,
    requestId,
    { env: 'alpha' }
  );

  expect(logs.length).toBeGreaterThan(0);
  console.log(`✓ Found ${logs.length} log entries`);

  await kibanaClient.disconnect();
}, 30000);
```

## Kibana Discover URL

Access logs directly in Kibana:
```
https://scb-mandatory-logging-np-kb.np.private.azscb.tech/s/scb-payment-domain-cloud/app/discover
```

## Index Pattern

All queries use the pattern:
```
logs-bill-payment-*
```

This includes indices like:
- `logs-bill-payment-2024.04.16`
- `logs-bill-payment-2024.04.17`
- etc.

## What Gets Logged

The framework logs:
- `correlationId`: Unique transaction ID
- `httpStatusCode`: Response status (200, 201, 400, 500, etc.)
- `uri`: Request endpoint
- `requestBody`: Full request payload
- `responseBody`: Full response payload
- `headers.x-request-id`: Request ID header
- `headers.requestUID`: Request UID header
- `@timestamp`: When the log was created
- `env`: Environment (alpha, beta, prod)

## Performance Tips

1. **Limit results**: Use `size: 10` for faster queries
2. **Narrow time range**: Query specific hours instead of days
3. **Use environment filter**: Default is 'alpha', be specific
4. **Reuse connections**: Keep client alive across multiple queries
5. **Index management**: Archive old logs regularly

## Next Steps

For more details, see:
- [KIBANA_CONFIGURATION.md](./KIBANA_CONFIGURATION.md) - Full configuration guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [README.md](./README.md) - Project overview
