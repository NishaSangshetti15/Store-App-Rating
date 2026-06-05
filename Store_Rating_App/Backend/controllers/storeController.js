const db = require("../config/db");

exports.getStores = async (req, res) => {
  try {
    const baseQuery = `
      SELECT
        stores.*,
        users.name AS owner_name,
        ROUND(AVG(ratings.rating),1) AS avg_rating
      FROM stores
      LEFT JOIN users ON users.id = stores.owner_id
      LEFT JOIN ratings ON ratings.store_id = stores.id
    `;

    let query = baseQuery + ` GROUP BY stores.id, users.name`;
    let params = [];

    if (req.user && req.user.role === "owner") {
      query = baseQuery + ` WHERE stores.owner_id = ? GROUP BY stores.id, users.name`;
      params = [req.user.id];
    }

    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (error) {
    res.status(500).json(error);
  }
};