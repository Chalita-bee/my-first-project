import { Client } from '@elastic/elasticsearch';
import { elasticsearchConfig, getElasticsearchAuth } from '../src/config/settings';

async function inspectLogDocument() {
  const auth = getElasticsearchAuth();
  const client = new Client({
    node: elasticsearchConfig.host,
    ...(auth && { auth }),
  });

  const newRequestId = 'BE260416183336dbfd7535';

  try {
    console.log(`\n=== ตรวจสอบ Document Structure ===\n`);

    const result = await client.search({
      index: 'scb-payment-domain-for-backdoor-request-*',
      query: {
        match: { correlationId: newRequestId }
      },
      size: 1,
    });

    if (result.hits?.hits && result.hits.hits.length > 0) {
      const doc = result.hits.hits[0]._source as any;

      console.log('📄 Document Fields:');
      console.log('─'.repeat(60));

      Object.entries(doc).forEach(([key, value]) => {
        let displayValue = '';

        if (typeof value === 'string') {
          displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value).substring(0, 50) + '...';
        } else {
          displayValue = String(value);
        }

        // Highlight fields ที่มี request ID
        if (displayValue.includes(newRequestId)) {
          console.log(`🔍 ${key}: ${displayValue}`);
        } else {
          console.log(`   ${key}: ${displayValue}`);
        }
      });

      console.log('\n' + '─'.repeat(60));
      console.log('\n✅ ค้นหาได้ 13 documents ด้วย query: match { correlationId: ... }');
      console.log('\n💡 ปัญหา: Test ของเรา ใช้ query เดียวกัน แต่ทำไมค้นหาไม่ได้?');
      console.log('   ลองดู: timeout, size, หรือ query builder?');
    }

    await client.close();
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

inspectLogDocument();
