import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function checkNewIndex() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  try {
    console.log('\n=== ตรวจสอบ Index Pattern ใหม่ ===\n');

    // ค้นหาโดย pattern ใหม่
    const result = await client.search({
      index: 'scb-payment-domain-for-backdoor-request-*',
      query: { match_all: {} },
      size: 3,
    });

    const totalHits = (result.hits?.total as any)?.value || 0;
    console.log(`✓ Found ${totalHits} documents in scb-payment-domain-for-backdoor-request-*`);

    if (result.hits?.hits && result.hits.hits.length > 0) {
      console.log(`\n=== ตัวอย่าง ${result.hits.hits.length} Documents ===\n`);

      result.hits.hits.forEach((hit, idx) => {
        const doc = hit._source as any;
        console.log(`Document ${idx + 1}:`);
        console.log(`  Index: ${hit._index}`);
        console.log(`  Timestamp: ${doc['@timestamp'] || doc.timestamp}`);

        // ตรวจสอบ requestUID
        const requestId = doc.requestUID || doc.request_uid || doc.requestId;
        if (requestId) {
          console.log(`  requestUID: ${requestId}`);
        }

        console.log(`  Fields:`);
        Object.keys(doc).slice(0, 15).forEach(key => {
          console.log(`    - ${key}`);
        });
        console.log();
      });
    } else {
      console.log('⚠️  Index pattern found but no documents');
    }

    await client.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.statusCode) console.error('Status:', error.statusCode);
  }
}

checkNewIndex();
