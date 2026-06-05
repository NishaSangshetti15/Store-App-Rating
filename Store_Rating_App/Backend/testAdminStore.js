const http = require('http');
const post = (path, body, token) => new Promise((resolve,reject)=>{
  const data = JSON.stringify(body);
  const headers = {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)};
  if(token) headers.Authorization = `Bearer ${token}`;
  const options = {hostname:'localhost',port:5000,path,method:'POST',headers};
  const req = http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.write(data); req.end();
});
const get = (path, token) => new Promise((resolve,reject)=>{
  const headers = {}; if(token) headers.Authorization=`Bearer ${token}`;
  const options = {hostname:'localhost',port:5000,path,method:'GET',headers};
  const req = http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode,body:chunks}));}); req.on('error',reject); req.end();
});
(async()=>{
  const loginData = await post('/api/auth/login',{email:'admin@example.com',password:'NewAdmin123!'});
  console.log('login', loginData.statusCode, loginData.body);
  if(loginData.statusCode!==200) return;
  const token = JSON.parse(loginData.body).token;
  const createStore = await post('/api/admin/stores',{name:'Owner Assigned Store',email:'ownerstore@example.com',address:'Owner Address',owner_id:5},token);
  console.log('createStore', createStore.statusCode, createStore.body);
  const ownerLogin = await post('/api/auth/login',{email:'owner@example.com',password:'Owner123!'});
  console.log('ownerLogin', ownerLogin.statusCode, ownerLogin.body);
  if(ownerLogin.statusCode!==200) return;
  const ownerToken = JSON.parse(ownerLogin.body).token;
  const stores = await get('/api/stores', ownerToken);
  console.log('ownerStores', stores.statusCode, stores.body);
})();
