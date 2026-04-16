import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function searchRequestInNewIndex() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  // ค้นหาจากหลาย requestUID (จากการทดสอบที่ผ่านมา)
  const requestIds = [
    'BE26041618240822a78e81', // ล่าสุดจากการทดสอบ
    'BE26041618241300e79fcaff',
    'BE2604161819384084b841',
  ];

  try {
    console.log('\n=== ค้นหา Request IDs ในนี้ใหม่ ===\n');

    // ลองค้นหาด้วยฟิลด์ต่าง ๆ
    const fields = ['correlationId', 'requestUID', 'request_uid', 'headers.x-request-id'];

    for (const requestId of requestIds) {
      console.log(`\nค้นหา: ${requestId}`);
      let found = false;

      for (const field of fields) {
        try {
          const result = await client.search({
            index: 'scb-payment-domain-for-backdoor-request-*',
            query: {
              bool: {
                should: [
                  { match: { [field]: requestId } },
                  { term: { [`${field}.keyword`]: requestId } }
                ]
              }
            },
            size: 1,
          });

          const totalHits = (result.hits?.total as any)?.value || 0;
          if (totalHits > 0) {
            console.log(`  ✓ Found ${totalHits} in field: ${field}`);
            const doc = result.hits?.hits?.[0]._source as any;
            console.log(`    Timestamp: ${doc['@timestamp']}`);
            console.log(`    Method: ${doc.method}`);
            console.log(`    URI: ${doc.uri}`);
            console.log(`    correlationId: ${doc.correlationId}`);
            found = true;
            break;
          }
        } catch (e) {
          // silent
        }
      }

      if (!found) {
        console.log(`  ⚠️  Not found in this index`);
      }
    }

    // ค้นหา requests ล่าสุด
    console.log('\n=== Requests ล่าสุด ===\n');
    const latestResult = await client.search({
      index: 'scb-payment-domain-for-backdoor-request-*',
      query: { match_all: {} },
      size: 5,
      sort: [{ '@timestamp': { order: 'desc' } }],
    });

    if (latestResult.hits?.hits) {
      latestResult.hits.hits.forEach((hit, idx) => {
        const doc = hit._source as any;
        console.log(`${idx + 1}. ${doc['@timestamp']} - ${doc.method} ${doc.uri}`);
        console.log(`   correlationId: ${doc.correlationId}`);
      });
    }

    await client.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

searchRequestInNewIndex();
