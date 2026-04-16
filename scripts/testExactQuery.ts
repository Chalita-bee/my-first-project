import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';
import { ELASTICSEARCH_FIELDS, CORRELATION_ID_FIELDS, DEFAULT_ENVIRONMENT, DEFAULT_PAGE_SIZE } from '../src/config/elasticsearchConstants';

async function testExactQuery() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  const newRequestId = 'BE260416183336dbfd7535';
  const indexPattern = 'scb-payment-domain-for-backdoor-request-*';
  const env = 'alpha';
  const size = 20;

  try {
    console.log(`\n=== ทดสอบ Exact Query จากเรา ===\n`);
    console.log(`Request ID: ${newRequestId}`);
    console.log(`Index: ${indexPattern}`);
    console.log(`Environment: ${env}`);
    console.log(`Size: ${size}\n`);

    // สร้าง query เหมือนกับใน getLogsByCorrelationId
    const shouldClauses: any[] = CORRELATION_ID_FIELDS.map(field => ({
      match: { [field]: newRequestId }
    }));

    shouldClauses.push(
      { term: { 'correlationId.keyword': newRequestId } },
      { term: { 'requestUID.keyword': newRequestId } },
      { term: { 'X-Request-ID.keyword': newRequestId } },
      { term: { 'headers.requestUID.keyword': newRequestId } },
      { term: { 'headers.x-request-id.keyword': newRequestId } }
    );

    const query = {
      bool: {
        should: shouldClauses,
        minimum_should_match: 1
      }
    };

    // Build query (เหมือนใน buildQuery)
    const must: any[] = [query];
    must.push({ match: { [ELASTICSEARCH_FIELDS.ENVIRONMENT]: env } });

    const finalQuery = { bool: { must } };

    console.log('🔍 Final Query:');
    console.log(JSON.stringify(finalQuery, null, 2).substring(0, 500));

    console.log('\n⏳ Searching...\n');

    const startTime = Date.now();
    const result = await client.search({
      index: indexPattern,
      query: finalQuery,
      size,
    });
    const elapsed = Date.now() - startTime;

    const totalHits = (result.hits?.total as any)?.value || 0;
    console.log(`✅ Found ${totalHits} documents (${elapsed}ms)`);

    if (result.hits?.hits && result.hits.hits.length > 0) {
      console.log(`\n✓ Sample Results:`);
      result.hits.hits.slice(0, 3).forEach((hit, idx) => {
        const doc = hit._source as any;
        console.log(`  ${idx + 1}. ${doc['@timestamp']} - ${doc.method} ${doc.uri}`);
      });
    } else {
      console.log(`\n❌ NO RESULTS FOUND`);
    }

    await client.close();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testExactQuery();
