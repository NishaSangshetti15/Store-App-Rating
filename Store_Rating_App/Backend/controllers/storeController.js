const db = require("../config/db");

exports.getStores = async (req, res) => {

  const [stores] = await db.query(`
    SELECT
    stores.*,
    ROUND(AVG(ratings.rating),1)
    AS avg_rating

    FROM stores

    LEFT JOIN ratings
    ON ratings.store_id = stores.id

    GROUP BY stores.id
  `);

  res.json(stores);
};