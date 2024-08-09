const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardControllers");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/cars", authMiddleware, cardController.getCars);
router.post("/cars", authMiddleware, cardController.postCar);

module.exports = router;
