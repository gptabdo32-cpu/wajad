const express = require('express');
const router = express.Router();
const { generateItinerary, getItinerary, deleteItinerary } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/v1/itinerary/generate
// @desc    Generate a new itinerary based on user preferences
// @access  Private (Requires authentication)
router.post('/generate', protect, generateItinerary);

// @route   GET /api/v1/itinerary/:id
// @desc    Get a specific itinerary by ID
// @access  Private (Requires authentication)
router.get('/:id', protect, getItinerary);

// @route   DELETE /api/v1/itinerary/:id
// @desc    Delete a specific itinerary by ID
// @access  Private (Requires authentication)
router.delete('/:id', protect, deleteItinerary);

module.exports = router;
