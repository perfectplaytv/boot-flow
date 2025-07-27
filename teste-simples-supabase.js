const https = require('https');

const url = 'https://zluggifavplgsxzbupiq.supabase.co/rest/v1/';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdWdnaWZhdnBsZ3N4emJ1cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTM0MTgsImV4cCI6MjA2ODY2OTQxOH0.WTwWCO09lVv3JIcI49WX4Ho7cPv6WNUlv5AzsjEBN14';

console.log('🔄 Testando conexão básica com Supabase...');
console.log('📍 URL:', url);

const options = {
  hostname: 'zluggifavplgsxzbupiq.supabase.co',
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('📋 Headers:', res.headers);
  
  res.on('data', (data) => {
    console.log('📄 Resposta:', data.toString());
  });
});

req.on('error', (error) => {
  console.error('❌ Erro:', error.message);
});

req.end();