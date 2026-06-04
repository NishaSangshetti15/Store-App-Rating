const db = require("../config/db");

exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    const [existing] = await db.query(
      "SELECT * FROM ratings WHERE user_id=? AND store_id=?",
      [req.user.id, storeId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Rating already submitted. Use update."
      });
    }

    const [store] = await db.query(
  "SELECT id FROM stores WHERE id=?",
  [storeId]
);

if (store.length === 0) {
  return res.status(404).json({
    message: "Store not found"
  });
}

    await db.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [req.user.id, storeId, rating]
    );

    res.json({
      message: "Rating submitted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { rating } = req.body;

    await db.query(
      "UPDATE ratings SET rating=? WHERE id=? AND user_id=?",
      [rating, req.params.id, req.user.id]
    );

    res.json({
      message: "Rating updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getMyRatings = async (req, res) => {
  try {
    const [ratings] = await db.query(
      `SELECT r.id, s.name AS store_name, r.rating
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id=?`,
      [req.user.id]
    );

    res.json(ratings);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};