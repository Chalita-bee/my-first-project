import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function findNewRequestInAllIndices() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  // requestUID จากการทดสอบล่าสุด
  const newRequestId = 'BE260416183336dbfd7535';
  const oldRequestId = 'BE26041618240822a78e81'; // เพื่อเปรียบเทียบ

  try {
    console.log(`\n=== ค้นหา Request IDs ในทุก Index ===\n`);

    // ลองค้นหาในหลาย index patterns
    const indexPatterns = [
      'logs-*',
      'scb-payment-domain-for-backdoor-request-*',
      'logs-bill-payment-*',
      'logs-app-*',
      '.ds-*',
    ];

    for (const pattern of indexPatterns) {
      console.log(`\n--- Index Pattern: ${pattern} ---`);

      try {
        // ลองค้นหา request ใหม่
        const result = await client.search({
          index: pattern,
          query: {
            bool: {
              should: [
                { match: { correlationId: newRequestId } },
                { match: { requestUID: newRequestId } },
                { match: { request_id: newRequestId } },
                { term: { 'correlationId.keyword': newRequestId } },
                { term: { 'requestUID.keyword': newRequestId } },
              ]
            }
          },
          size: 3,
        });

        const newCount = (result.hits?.total as any)?.value || 0;
        console.log(`  New Request (${newRequestId}): ${newCount} docs`);

        // ลองค้นหา request เก่า
        const oldResult = await client.search({
          index: pattern,
          query: {
            bool: {
              should: [
                { match: { correlationId: oldRequestId } },
                { match: { requestUID: oldRequestId } },
                { term: { 'correlationId.keyword': oldRequestId } },
                { term: { 'requestUID.keyword': oldRequestId } },
              ]
            }
          },
          size: 1,
        });

        const oldCount = (oldResult.hits?.total as any)?.value || 0;
        console.log(`  Old Request (${oldRequestId}): ${oldCount} docs`);

        // ถ้าเจอ logs ใหม่ ให้แสดงรายละเอียด
        if (newCount > 0) {
          console.log(`  \n  ✓ FOUND NEW REQUEST LOGS!`);
          const doc = result.hits?.hits?.[0]._source as any;
          console.log(`    Timestamp: ${doc['@timestamp'] || doc.timestamp}`);
          console.log(`    Method: ${doc.method}`);
          console.log(`    URI: ${doc.uri}`);
        }
      } catch (e: any) {
        if (e.statusCode === 404) {
          console.log(`  ⚠️  Index not found`);
        } else {
          console.log(`  ❌ Error: ${e.message}`);
        }
      }
    }

    await client.close();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

findNewRequestInAllIndices();
