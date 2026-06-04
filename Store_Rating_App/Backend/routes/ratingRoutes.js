const router = require("express").Router();

const auth = require("../middleware/auth");


const {
  submitRating,
  updateRating,
  getMyRatings
} = require("../controllers/ratingController");

router.post("/", auth, submitRating);
router.put("/:id", auth, updateRating);
router.get("/my-ratings", auth, getMyRatings);

module.exports = router;