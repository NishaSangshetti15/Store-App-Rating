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

exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, address, role FROM users"
    );

    res.json({ users });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const bcrypt = require("bcryptjs");

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name,email,password,address,role) VALUES(?,?,?,?,?)`,
      [name, email, hashedPassword, address || "", role]
    );

    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Store name is required" });
    }

    await db.query(
      `INSERT INTO stores (name,email,address,owner_id) VALUES(?,?,?,?)`,
      [name, email || "", address || "", owner_id || null]
    );

    res.json({ message: "Store created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};