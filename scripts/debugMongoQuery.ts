import MongoDBClient from '../src/utils/mongoClient';
import { COLLECTIONS } from '../src/config/constants';

async function debugMongoQuery() {
  const mc = new MongoDBClient();
  const requestId = 'BE260716112101cfe80c73'; // Request ID ล่าสุด

  try {
    console.log(`\n=== MongoDB Query Debug ===\n`);
    console.log(`Request ID: ${requestId}\n`);

    await mc.connect();

    console.log('--- Searching by requestUID ---');
    let transaction = await mc.findOne(
      COLLECTIONS.BACKDOOR_TRANSACTION,
      { requestUID: requestId }
    );

    if (transaction) {
      console.log(`✓ Found by requestUID`);
      console.log(`  ID: ${(transaction as any)._id}`);
      console.log(`  createdDate: ${(transaction as any).createdDate}`);
      console.log(`  transactionStatus: ${(transaction as any).transactionStatus}`);
    } else {
      console.log(`✗ Not found by requestUID`);

      console.log('\n--- Searching by correlationId ---');
      transaction = await mc.findOne(
        COLLECTIONS.BACKDOOR_TRANSACTION,
        { correlationId: requestId }
      );

      if (transaction) {
        console.log(`✓ Found by correlationId`);
      } else {
        console.log(`✗ Not found by correlationId`);
      }
    }

    console.log('\n--- Checking latest documents ---');
    const collection = (mc as any).client?.db((mc as any).database).collection(COLLECTIONS.BACKDOOR_TRANSACTION);

    if (collection) {
      const latest = await collection
        .find({})
        .sort({ createdDate: -1 })
        .limit(5)
        .toArray();

      console.log(`Found ${latest.length} latest documents:\n`);
      latest.forEach((doc: any, idx: number) => {
        console.log(`${idx + 1}. requestUID: ${doc.requestUID}`);
        console.log(`   Date: ${doc.createdDate}`);
        console.log(`   Status: ${doc.transactionStatus}\n`);
      });
    }

    console.log('--- Query Analysis ---');
    console.log(`Looking for: ${requestId}`);
    console.log(`Collection: ${COLLECTIONS.BACKDOOR_TRANSACTION}`);
    console.log(`Field 1: requestUID`);
    console.log(`Field 2: correlationId (fallback)`);

    await mc.disconnect();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

debugMongoQuery();
