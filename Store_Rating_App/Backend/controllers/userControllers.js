const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password=? WHERE id=?",
      [hashedPassword, req.user.id]
    );

    res.json({
      message: "Password Updated Successfully"
    });

  } catch (error) {
    res.status(500).json(error);
  }
};