const db = require('./config/db');
(async ()=>{
  try {
    const [rows] = await db.query('SELECT id,name,email,role,password FROM users LIMIT 10');
    console.log(JSON.stringify(rows,null,2));
  } catch(e) {
    console.error(e);
  }
})();
