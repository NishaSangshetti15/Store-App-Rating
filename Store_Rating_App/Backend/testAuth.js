const http = require('http');
const post = (path, body) => new Promise((resolve,reject)=>{
  const data = JSON.stringify(body);
  const options = {hostname:'localhost',port:5000,path,method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};
  const req=http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.write(data); req.end();
});
const put = (path, body, token) => new Promise((resolve,reject)=>{
  const data = JSON.stringify(body);
  const headers={'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)};
  if(token) headers.Authorization = `Bearer ${token}`;
  const options={hostname:'localhost',port:5000,path,method:'PUT',headers};
  const req=http.request(options,res=>{let chunks=''; res.on('data',d=>chunks+=d); res.on('end',()=>resolve({statusCode:res.statusCode, body:chunks}));}); req.on('error',reject); req.write(data); req.end();
});
(async()=>{
  const adminLogin = await post('/api/auth/login',{email:'admin@example.com',password:'Admin123!'});
  console.log('adminLogin', adminLogin.statusCode, adminLogin.body);
  const token = JSON.parse(adminLogin.body).token;
  const pwChange = await put('/api/users/change-password',{password:'NewAdmin123!'}, token);
  console.log('adminPwChange', pwChange.statusCode, pwChange.body);
})();
