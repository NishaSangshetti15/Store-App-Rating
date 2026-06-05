const http = require('http');
const post = (path, body) => new Promise((resolve, reject) => {
  const data = JSON.stringify(body);
  const options = {
    hostname: 'localhost',
    port: 5000,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const req = http.request(options, res => {
    let chunks = '';
    res.on('data', d => chunks += d);
    res.on('end', () => resolve({ statusCode: res.statusCode, body: chunks }));
  });
  req.on('error', reject);
  req.write(data);
  req.end();
});
(async () => {
  let res = await post('/api/auth/register', { name: 'Test User', email: 'testuser@example.com', password: 'Test1234!', address: '123 Test St' });
  console.log('register', res.statusCode, res.body);
  res = await post('/api/auth/login', { email: 'testuser@example.com', password: 'Test1234!' });
  console.log('login', res.statusCode, res.body);
})();
