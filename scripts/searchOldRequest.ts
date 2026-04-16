import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function searchOldRequest() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  // ค้นหาจากการทดสอบที่เก่า
  const oldRequestId = 'BE26041618240822a78e81';

  try {
    console.log(`\n=== ค้นหา ${oldRequestId} ใน index pattern ใหม่ ===\n`);

    const result = await client.search({
      index: 'scb-payment-domain-for-backdoor-request-*',
      query: {
        bool: {
          should: [
            { match: { correlationId: oldRequestId } },
            { term: { 'correlationId.keyword': oldRequestId } }
          ]
        }
      },
      size: 5,
      sort: [{ '@timestamp': { order: 'desc' } }],
    });

    const totalHits = (result.hits?.total as any)?.value || 0;
    console.log(`Found ${totalHits} documents\n`);

    if (result.hits?.hits) {
      result.hits.hits.forEach((hit, idx) => {
        const doc = hit._source as any;
        console.log(`${idx + 1}. ${doc['@timestamp']}`);
        console.log(`   Method: ${doc.method}`);
        console.log(`   URI: ${doc.uri}`);
        console.log(`   correlationId: ${doc.correlationId}`);
        console.log(`   Log: ${(doc.log || '').substring(0, 100)}`);
        console.log();
      });
    }

    await client.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

searchOldRequest();
