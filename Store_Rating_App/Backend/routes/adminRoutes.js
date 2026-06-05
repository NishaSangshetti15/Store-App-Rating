const router = require("express").Router();

const auth = require("../middleware/auth");
const role = require("../middleware/roleMiddleware");

const {
  getDashboard,
  getUsers,
  createUser
} = require("../controllers/adminController");
const {
  createStore
} = require("../controllers/adminController");

router.get("/dashboard", auth, role("admin"), getDashboard);

// Admin-only: list users
router.get("/users", auth, role("admin"), getUsers);

// Admin-only: create user (user or owner)
router.post("/users", auth, role("admin"), createUser);

// Admin-only: create store and assign to owner
router.post("/stores", auth, role("admin"), createStore);

module.exports = router;