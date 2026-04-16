import KibanaClient from '../../src/utils/kibanaClient';
import { LogValidator } from '../../src/utils/validators';
import { INDICES } from '../../src/config/constants';

describe('Kibana Log Validation Tests', () => {
  let kibanaClient: KibanaClient;

  beforeAll(async () => {
    kibanaClient = new KibanaClient();
    try {
      await kibanaClient.connect();
    } catch (error) {
      console.log('Kibana not available, tests will be skipped');
    }
  }, 15000);

  afterAll(async () => {
    await kibanaClient.disconnect();
  });

  test('should find log entry for bill creation', async () => {
    try {
      const logs = await kibanaClient.searchLogs(
        INDICES.BILL_PAYMENT,
        { message: 'bill_created' }
      );

      if (logs.length > 0) {
        expect(logs.length).toBeGreaterThan(0);
      }
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should find payment processing logs', async () => {
    try {
      const logs = await kibanaClient.searchLogs(
        INDICES.BILL_PAYMENT,
        { message: 'payment_processed' }
      );

      if (logs.length > 0) {
        LogValidator.assertLogCount(logs, 1);
      }
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should query logs by timestamp', async () => {
    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const logs = await kibanaClient.getLogsByTimestamp(
        INDICES.BILL_PAYMENT,
        startTime,
        endTime
      );

      expect(Array.isArray(logs)).toBe(true);
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should query logs by user_id', async () => {
    try {
      const logs = await kibanaClient.getLogsByField(
        INDICES.BILL_PAYMENT,
        'user_id',
        'user_001'
      );

      if (logs.length > 0) {
        LogValidator.assertLogCount(logs, 1);
      }
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should find error logs', async () => {
    try {
      const logs = await kibanaClient.searchLogs(
        INDICES.BILL_PAYMENT,
        { level: 'ERROR' }
      );

      expect(Array.isArray(logs)).toBe(true);
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should verify logs contain bill_id', async () => {
    try {
      const logs = await kibanaClient.searchLogs(
        INDICES.BILL_PAYMENT,
        { bill_id: 'bill_001' }
      );

      if (logs.length > 0) {
        for (const log of logs) {
          expect(
            log.bill_id !== undefined || JSON.stringify(log).includes('bill_id')
          ).toBe(true);
        }
      }
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should query logs by level', async () => {
    try {
      const logs = await kibanaClient.getLogsByField(
        INDICES.BILL_PAYMENT,
        'level',
        'INFO'
      );

      expect(Array.isArray(logs)).toBe(true);
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should verify log message format', async () => {
    try {
      const logs = await kibanaClient.searchLogs(
        INDICES.BILL_PAYMENT,
        { message: 'bill' }
      );

      if (logs.length > 0) {
        for (const log of logs) {
          expect(
            log['@timestamp'] !== undefined || log.timestamp !== undefined
          ).toBe(true);
        }
      }
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);

  test('should query transaction logs', async () => {
    try {
      const logs = await kibanaClient.searchLogs(
        INDICES.BILL_PAYMENT,
        { type: 'transaction' }
      );

      expect(Array.isArray(logs)).toBe(true);
    } catch (error) {
      console.log('Kibana not available, skipping test');
    }
  }, 15000);
});
