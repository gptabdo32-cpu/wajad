// siyaha-alkhums/controllers/itineraryController.js
const supabaseClient = require('../utils/supabaseClient');
const db = supabaseClient.db; // Assuming db is the Supabase client instance

/**
 * Helper function to calculate the distance between two coordinates (Haversine formula)
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Helper function to generate a dynamic itinerary based on user preferences and POIs.
 * This is a simplified greedy algorithm for demonstration.
 * @param {Array<Object>} pois - List of available POIs.
 * @param {Object} preferences - User preferences (e.g., categories, duration, start location).
 * @returns {Array<Object>} - Suggested itinerary.
 */
/**
 * Helper function to determine if a POI is open at a given time (simplified)
 * @param {Object} poi - Point of Interest object
 * @param {number} timeInHours - Current time in hours (e.g., 9.5 for 9:30 AM)
 * @returns {boolean} - True if open, false otherwise
 */
function isPOIOpen(poi, timeInHours) {
    // Simplified logic: Assume all POIs are open between 8 AM and 6 PM (8 to 18)
    // In a real scenario, POI object would have opening_hours field
    const openTime = poi.openTime || 8;
    const closeTime = poi.closeTime || 18;
    return timeInHours >= openTime && timeInHours < closeTime;
}

/**
 * Helper function to calculate travel time based on transport mode
 * @param {number} distance - Distance in kilometers
 * @param {string} transportMode - 'car', 'walk', 'public'
 * @returns {number} - Travel time in hours
 */
function calculateTravelTime(distance, transportMode) {
    const speeds = {
        car: 40, // 40 km/h average
        walk: 5, // 5 km/h average
        public: 20 // 20 km/h average (including waiting time)
    };
    const speed = speeds[transportMode] || speeds.car;
    return distance / speed;
}

function generateItinerary(pois, preferences) {
    const { categories = [], duration = 8, startLat, startLon, transportMode = 'car', startTime = 9 } = preferences; // duration in hours, startTime in hours (e.g., 9 for 9 AM)
    const maxDistance = 50; // Max distance to consider POIs from start point (km)
    const averageVisitTime = 1.5; // Average time to visit a POI in hours
    const maxPOIs = Math.floor(duration / averageVisitTime);

    if (!startLat || !startLon) {
        return { error: "Start location is required for itinerary generation." };
    }

    // 1. Filter POIs based on categories and distance
    let filteredPOIs = pois.filter(poi => {
        const isRelevantCategory = categories.length === 0 || categories.includes(poi.category);
        // Assuming POI coordinates are stored as [longitude, latitude] for GeoJSON standard
        const distance = calculateDistance(startLat, startLon, poi.location.coordinates[1], poi.location.coordinates[0]);
        return isRelevantCategory && distance <= maxDistance;
    });

    // 2. Sort POIs by relevance (e.g., rating, distance)
    // For simplicity, we'll sort by distance first, then by a mock rating
    filteredPOIs.sort((a, b) => {
        const distA = calculateDistance(startLat, startLon, a.location.coordinates[1], a.location.coordinates[0]);
        const distB = calculateDistance(startLat, startLon, b.location.coordinates[1], b.location.coordinates[0]);
        if (distA !== distB) {
            return distA - distB;
        }
        // Mock rating: assuming a 'rating' field exists
        return (b.rating || 0) - (a.rating || 0);
    });

    // 3. Greedy selection to build the itinerary
    let itinerary = [];
    let currentTime = 0; // Time in hours
    let currentLat = startLat;
    let currentLon = startLon;

    for (let i = 0; i < filteredPOIs.length && itinerary.length < maxPOIs; i++) {
        const poi = filteredPOIs[i];
        const distance = calculateDistance(currentLat, currentLon, poi.location.coordinates[1], poi.location.coordinates[0]);
        const travelTime = calculateTravelTime(distance, transportMode);
        
        // Check if the POI is open at the estimated arrival time
        const arrivalTime = currentTime + travelTime;
        
        if (!isPOIOpen(poi, arrivalTime)) {
            // Skip this POI if it's closed at arrival time
            continue;
        }

        const totalTime = currentTime + travelTime + averageVisitTime;

        if (totalTime <= duration) {
            itinerary.push({
                poiId: poi._id,
                name: poi.name,
                category: poi.category,
                startTime: arrivalTime, // Start time is arrival time
                travelTime: travelTime,
                visitTime: averageVisitTime,
                endTime: totalTime,
                location: poi.location.coordinates,
                transportMode: transportMode
            });
            currentTime = totalTime;
            currentLat = poi.location.coordinates[1];
            currentLon = poi.location.coordinates[0];
        }
    }

    return itinerary;
}

/**
 * @route POST /api/v1/itinerary/generate
 * @desc Generate a personalized itinerary
 * @access Private
 */
exports.generateItinerary = async (req, res) => {
    try {
        // In a real application, you would get user preferences from the request body
        // and potentially from the authenticated user's profile (User model).
        const {
            userId, // Optional: to fetch preferences from User model
            startLat,
            startLon,
            duration, // e.g., 8 hours
            categories, // e.g., ["Archaeological", "Nature", "Food"]
            transportMode, // e.g., "car", "walk"
            startTime // e.g., 9 (for 9 AM)
        } = req.body;

        let preferences = { startLat, startLon, duration, categories, transportMode, startTime };

        // 1. Fetch all POIs from the database
        // In a real scenario, you might use geo-spatial queries here for better performance
        // 1. Fetch all POIs from the database using a PostGIS query
        // ST_DWithin: checks if two geometries are within a given distance (in meters)
        const { data: pois, error } = await db
            .from('pois')
            .select('*')
            .rpc('st_dwithin', {
                geom1: `POINT(${startLon} ${startLat})`,
                geom2: 'location',
                distance_meters: 50000 // 50 km
            });

        if (error) {
            console.error("Supabase POI Fetch Error:", error);
            return res.status(500).json({ msg: "Database error fetching POIs." });
        }

        if (!pois || pois.length === 0) {
            return res.status(404).json({ msg: "No Points of Interest found nearby." });
        }

        // 2. Generate the itinerary
        const itinerary = generateItinerary(pois, preferences);

        if (itinerary.error) {
            return res.status(400).json({ msg: itinerary.error });
        }

        res.json({
            msg: "Itinerary generated successfully based on advanced personalization logic.",
            preferences: preferences,
            itinerary: itinerary
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

/**
 * @route GET /api/v1/itinerary/:id
 * @desc Get a specific itinerary by ID
 * @access Private
 */
exports.getItinerary = async (req, res) => {
    // This function would typically fetch a saved itinerary from a database table (e.g., 'itineraries')
    // Since no 'itineraries' table was defined in the schema, we'll return a placeholder.
    res.status(501).json({ msg: "Itinerary retrieval not yet implemented. Requires 'itineraries' table." });
};

/**
 * @route DELETE /api/v1/itinerary/:id
 * @desc Delete a specific itinerary by ID
 * @access Private
 */
exports.deleteItinerary = async (req, res) => {
    // This function would typically delete a saved itinerary from a database table
    res.status(501).json({ msg: "Itinerary deletion not yet implemented. Requires 'itineraries' table." });
};
