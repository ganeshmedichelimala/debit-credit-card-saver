const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardControllers");

const authMiddleware = require("../middleware/authMiddleware");

// Route to get all cars for the authenticated user
// GET /api/cards/cars
router.get("/cars", authMiddleware, cardController.getCars);

// Route to add a new car for the authenticated user
// POST /api/cards/cars
router.post("/cars", authMiddleware, cardController.postCar);

module.exports = router;
