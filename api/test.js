export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Test the upstash functions
      const { getJson, setJson } = await import('../lib/upstash.js');
      
      // Test read
      const testData = await getJson('test-key', null);
      console.log('Test read result:', testData);
      
      // Test write
      const writeResult = await setJson('test-key', { test: 'data', timestamp: new Date().toISOString() });
      console.log('Test write result:', writeResult);
      
      // Test read again
      const testData2 = await getJson('test-key', null);
      console.log('Test read after write:', testData2);
      
      res.status(200).json({
        success: true,
        message: 'Test completed',
        read1: testData,
        writeResult: writeResult,
        read2: testData2,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Test error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
