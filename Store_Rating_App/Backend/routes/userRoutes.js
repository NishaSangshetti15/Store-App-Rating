const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  changePassword
} = require("../controllers/userControllers");

router.put(
  "/change-password",
  auth,
  changePassword
);

module.exports = router;