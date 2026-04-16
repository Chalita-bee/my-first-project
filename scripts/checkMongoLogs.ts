import MongoDBClient from '../src/utils/mongoClient';
import { COLLECTIONS } from '../src/config/constants';

async function checkMongoLogs() {
  const mc = new MongoDBClient();

  try {
    await mc.connect();

    console.log('\n=== Checking MongoDB Transaction Data ===\n');

    // Get the most recent transaction
    const transaction = await mc.findOne(COLLECTIONS.BACKDOOR_TRANSACTION, {});

    if (transaction) {
      console.log('✓ Found most recent transaction');
      console.log(`  ID: ${(transaction as any)._id}`);
      console.log(`  requestUID: ${(transaction as any).requestUID}`);
      console.log(`  createdDate: ${(transaction as any).createdDate}`);
      console.log(`  transactionStatus: ${(transaction as any).transactionStatus}`);

      console.log('\n  Top-level fields:');
      Object.keys(transaction).forEach(key => {
        const val = (transaction as any)[key];
        const type = Array.isArray(val) ? 'array' : typeof val;
        console.log(`    - ${key}: ${type}`);
      });

      console.log('\n  Metadata fields:');
      if ((transaction as any).metadata) {
        Object.keys((transaction as any).metadata).forEach(key => {
          console.log(`    - ${key}`);
        });
      }

      // Check if this could be queried by Kibana
      console.log('\n=== Could this data be in Kibana? ===');
      console.log('MongoDB has transaction data with:');
      console.log(`  - requestUID: ${(transaction as any).requestUID}`);
      console.log(`  - createdDate: ${(transaction as any).createdDate}`);
      console.log('\nBut Elasticsearch logs-* index has:');
      console.log('  - Only apm.error data_stream');
      console.log('  - No matching requestUID found');
      console.log('\nSolution: The logs need to be published from MongoDB to Elasticsearch,');
      console.log('or the API needs to write logs to a log aggregation service.');
    } else {
      console.log('⚠️  No transactions found');
    }

    await mc.disconnect();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

checkMongoLogs();
