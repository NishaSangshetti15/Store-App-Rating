const db = require('./config/db');
(async ()=>{
  try {
    const [rows] = await db.query('SELECT id,name,address,email,owner_id FROM stores LIMIT 20');
    console.log(JSON.stringify(rows,null,2));
  } catch(e) {console.error(e);} })();
