const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [stores] = await db.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [ratings] = await db.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    res.json({
      totalUsers: users[0].totalUsers,
      totalStores: stores[0].totalStores,
      totalRatings: ratings[0].totalRatings
    });

  } catch (error) {
    res.status(500).json(error);
  }
};