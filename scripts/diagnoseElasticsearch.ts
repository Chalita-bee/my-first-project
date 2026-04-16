import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function diagnoseElasticsearch() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  try {
    console.log('\n=== Checking Elasticsearch Connection ===');
    await client.ping();
    console.log('✓ Connected to Elasticsearch');

    console.log('\n=== Available Indices ===');
    const response = await client.indices.get({ index: '*' });
    const indices = response.body ? Object.keys(response.body) : [];

    indices.forEach(idx => {
      if (!idx.startsWith('.')) {
        console.log('  -', idx);
      }
    });

    console.log('\n=== Searching for logs in logs-* index ===');
    const searchResult = await client.search({
      index: 'logs-*',
      query: { match_all: {} },
      size: 3,
    });

    const totalHits = (searchResult.hits?.total as any)?.value || 0;
    console.log(`Found ${totalHits} total documents in logs-* index`);

    if (searchResult.hits?.hits && searchResult.hits.hits.length > 0) {
      console.log('\n=== Sample Document Structure ===');
      const doc = searchResult.hits.hits[0]._source as any;
      console.log('Fields present:');
      Object.keys(doc).forEach(key => {
        console.log(`  - ${key}`);
      });

      console.log('\n=== First Document (partial) ===');
      console.log(JSON.stringify(doc, null, 2).substring(0, 500) + '...');
    } else {
      console.log('⚠️  No documents found in logs-* index');
    }

    console.log('\n=== Searching for bills-payment index ===');
    try {
      const billsResult = await client.search({
        index: 'logs-bill-payment-*',
        query: { match_all: {} },
        size: 3,
      });
      const billsTotal = (billsResult.hits?.total as any)?.value || 0;
      console.log(`Found ${billsTotal} documents in logs-bill-payment-*`);
    } catch (e: any) {
      console.log('⚠️  Index logs-bill-payment-* not found or no access');
    }

    await client.close();
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.statusCode) console.error('Status Code:', error.statusCode);
  }
}

diagnoseElasticsearch();
