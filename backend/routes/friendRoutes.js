const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to send a friend request
// POST /api/friends/request
router.post("/request", authMiddleware, friendController.sendFriendRequest);

// Route to accept a friend request
// POST /api/friends/accept
router.post("/accept", authMiddleware, friendController.acceptFriendRequest);

// Route to get friend card details
// GET /api/friends/cards
router.get("/cards", authMiddleware, friendController.friendCard);


router.get("/list", authMiddleware, friendController.friends)

module.exports = router;
