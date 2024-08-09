const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

router.post(
  "/friends/request",
  authMiddleware,
  friendController.sendFriendRequest
);
router.post(
  "/friends/accept",
  authMiddleware,
  cardController.acceptFriendRequest
);

router.get("/friends/cards", authMiddleware, cardController.friendCard);
module.exports = router;
