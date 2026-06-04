const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  getStores
} = require("../controllers/storeController");

router.get("/", auth, getStores);

module.exports = router;