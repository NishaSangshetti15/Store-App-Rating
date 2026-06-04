const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      address
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users
      (name,email,password,address,role)
      VALUES(?,?,?,?,?)`,
      [
        name,
        email,
        hashedPassword,
        address,
        "user"
      ]
    );

    res.json({
      message: "Registration Successful"
    });

  } catch (err) {

    res.status(500).json(err);

  }
};

exports.login = async (req, res) => {
  try {

    const [user] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [req.body.email]
    );

    if (user.length === 0)
      return res.status(400).json({
        message: "User Not Found"
      });

    console.log("User:", user[0]);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user[0].password
    );

    console.log("Password Match:", validPassword);

    if (!validPassword)
      return res.status(400).json({
        message: "Wrong Password"
      });

    const token = jwt.sign(
      {
        id: user[0].id,
        role: user[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Generated Token:", token);

    res.json({
      token,
      role: user[0].role
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message
    });
  }
};

