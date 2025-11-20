// routes/poi.js
const express = require("express");
const {
  getAllPois, // تم تغيير الاسم
  getPoisInRadius,
  createPoi,
  searchPois,
  getAccommodation, // إضافة المسار الجديد
  getDining, // إضافة مسار المطاعم
  getTransport, // إضافة مسار النقل
} = require("../controllers/poiController");
const { protect, authorize } = require("../middleware/auth");
const validationMiddleware = require('../middleware/validationMiddleware');
const { createPOISchema } = require('../validation/poiValidation');

const router = express.Router();

// المسارات العامة
router.route("/all").get(getAllPois); // المسار الجديد لجلب الكل
router.route("/search").get(searchPois);
router.route("/radius/:distance/:lat/:lng").get(getPoisInRadius);
router.route("/accommodation").get(getAccommodation); // المسار الجديد لجلب الإقامة
router.route("/dining").get(getDining); // المسار الجديد لجلب المطاعم
router.route("/transport").get(getTransport); // المسار الجديد لجلب النقل

// المسارات الخاصة (تتطلب مصادقة)
router
  .route("/")
  .post(protect, authorize("admin", "guide"), validationMiddleware(createPOISchema), createPoi);

module.exports = router;
