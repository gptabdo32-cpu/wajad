// routes/api.js
const express = require("express");
const router = express.Router();

// Import controllers (to be implemented later)
const authController = require("../controllers/authController");
const poiController = require("../controllers/poiController");
// const paymentController = require("../controllers/paymentController");
// const myCredController = require("../controllers/myCredController");

// Example API route
router.get("/status", (req, res) => {
    res.json({ status: "API is running", version: "1.0" });
});

// Auth routes
// These will be implemented in the next phase
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// POI Routes
router.route("/pois")
    .get(poiController.getAllPOIs)
    .post(poiController.createPOI); // Needs Auth Middleware
router.get("/pois/search", poiController.searchPOIs);
router.get("/pois/nearby", poiController.findNearbyPOIs);
router.get("/pois/:id", poiController.getPOIById);

// Itinerary Generation Route
const itineraryController = require("../controllers/itineraryController");
router.post("/itinerary/generate", itineraryController.generatePersonalizedItinerary);

// Other routes will be added here

module.exports = router;
