const db = require('./config/db');
const bcrypt = require('bcryptjs');
(async ()=>{
  try {
    const adminHash = await bcrypt.hash('Admin123!', 10);
    const ownerHash = await bcrypt.hash('Owner123!', 10);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [adminHash, 'admin@example.com']);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [ownerHash, 'owner@example.com']);
    console.log('updated admin and owner passwords');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
})();
