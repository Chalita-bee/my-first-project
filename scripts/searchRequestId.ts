import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function searchRequestId() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  const requestId = 'BE26041618240822a78e81'; // From test output

  try {
    console.log(`\n=== Searching for requestId: ${requestId} ===\n`);

    // Search with multiple field names
    const fields = ['requestUID', 'requestId', 'request_id', 'transactionId', 'rquidCreditMain', 'correlationId', 'X-Request-ID'];

    for (const field of fields) {
      try {
        const result = await client.search({
          index: 'logs-*',
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

        const count = (result.hits?.total as any)?.value || 0;
        if (count > 0) {
          console.log(`✓ Found ${count} logs matching field: ${field}`);
          const doc = result.hits?.hits?.[0]._source as any;
          console.log(`  Index: ${result.hits?.hits?.[0]._index}`);
          console.log(`  Timestamp: ${doc['@timestamp'] || doc.timestamp}`);
          console.log(`  Message: ${(doc.message || '').substring(0, 100)}`);
          console.log(`  Service: ${doc.service?.name}`);
          console.log(`  Fields in doc:`);
          Object.keys(doc).slice(0, 15).forEach(k => {
            console.log(`    - ${k}`);
          });
        }
      } catch (e) {
        // Silent fail for fields that don't exist
      }
    }

    // Also check data_stream to understand index structure
    console.log('\n=== Checking data_stream field (index namespace) ===');
    const dsResult = await client.search({
      index: 'logs-*',
      query: { match_all: {} },
      size: 1,
      aggs: {
        data_streams: {
          terms: { field: 'data_stream.dataset', size: 20 }
        }
      }
    });

    if (dsResult.aggregations) {
      const agg = (dsResult.aggregations as any).data_streams;
      console.log('Available data_stream.dataset values:');
      agg.buckets?.forEach((bucket: any) => {
        console.log(`  - ${bucket.key} (${bucket.doc_count} docs)`);
      });
    }

    await client.close();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

searchRequestId();
