// routes/poi.js
const express = require("express");
const {
  getPois,
  getPoisInRadius,
  createPoi,
  searchPois,
} = require("../controllers/poiController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// المسارات العامة
router.route("/").get(getPois);
router.route("/search").get(searchPois);
router.route("/radius/:distance/:lat/:lng").get(getPoisInRadius);

// المسارات الخاصة (تتطلب مصادقة)
router
  .route("/")
  .post(protect, authorize("admin", "guide"), createPoi);

module.exports = router;
