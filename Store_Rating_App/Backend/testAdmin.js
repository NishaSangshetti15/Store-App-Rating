const http = require('http');
const post = (path, body, token) => new Promise((resolve,reject)=>{
  const data = JSON.stringify(body);
  const headers = {'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)};
  if(token) headers.Authorization = `Bearer ${token}`;
  const options = {hostname:'localhost',port:5000,path,method:'POST',headers};
  const req=http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.write(data); req.end();
});
const get = (path, token) => new Promise((resolve,reject)=>{
  const headers = {};
  if(token) headers.Authorization = `Bearer ${token}`;
  const options = {hostname:'localhost',port:5000,path,method:'GET',headers};
  const req=http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.end();
});
(async()=>{
  const login = await post('/api/auth/login',{email:'admin@example.com',password:'NewAdmin123!'});
  console.log('login', login.statusCode, login.body);
  if(login.statusCode!==200) return;
  const token = JSON.parse(login.body).token;
  const users = await get('/api/admin/users', token);
  console.log('users', users.statusCode, users.body);
})();
