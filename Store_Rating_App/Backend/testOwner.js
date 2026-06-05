const http = require('http');
const post = (path, body) => new Promise((resolve,reject)=>{
  const data = JSON.stringify(body);
  const options={hostname:'localhost',port:5000,path,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};
  const req=http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.write(data); req.end();
});
const get = (path, token) => new Promise((resolve,reject)=>{
  const headers = {}; if(token) headers.Authorization=`Bearer ${token}`;
  const options={hostname:'localhost',port:5000,path,method:'GET',headers};
  const req=http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.end();
});
(async()=>{
  const ownerLogin = await post('/api/auth/login',{email:'owner@example.com',password:'Owner123!'});
  console.log('ownerLogin', ownerLogin.statusCode, ownerLogin.body);
  if(ownerLogin.statusCode!==200) return;
  const token = JSON.parse(ownerLogin.body).token;
  const stores = await get('/api/stores', token);
  console.log('stores', stores.statusCode, stores.body);
})();
