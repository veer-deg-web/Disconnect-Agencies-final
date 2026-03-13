// Basic test script to verify AI blog generation
const fetch = require('node-fetch');

const CRON_SECRET = process.env.CRON_SECRET || 'your_secret_here';
const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

async function testGeneration() {
  console.log('--- Testing AI Blog Generation ---');
  console.log(`URL: ${BASE_URL}/api/cron?task=generate`);
  
  try {
    const res = await fetch(`${BASE_URL}/api/cron?task=generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    });
    
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));
    
    if (res.ok) {
      console.log('✅ AI Generation Test Passed!');
    } else {
      console.log('❌ AI Generation Test Failed!');
    }
  } catch (err) {
    console.error('❌ Network Error:', err.message);
  }
}

testGeneration();
