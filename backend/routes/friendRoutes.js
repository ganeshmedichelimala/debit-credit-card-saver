const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to send a friend request
// POST /api/friends/request
router.post("/friends/request", authMiddleware, friendController.sendFriendRequest);

// Route to accept a friend request
// POST /api/friends/accept
router.post("/friends/accept", authMiddleware, friendController.acceptFriendRequest);

// Route to get friend card details
// GET /api/friends/cards
router.get("/friends/cards", authMiddleware, friendController.friendCard);

module.exports = router;
