const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

exports.sendFriendRequest = async (req, res) => {
  const requesterId = req.user.id;
  const { recipientEmail } = req.body;

  try {
    const recipientUser = await User.findOne({ email: recipientEmail });
    if (!recipientUser) {
      console.log("Error: Recipient user not found", { recipientEmail });
      return res.status(404).json({ message: "User not found" });
    }
    const recipientId = recipientUser._id.toString();

    const existingRequest = await FriendRequest.findOne({
      requester: requesterId,
      recipient: recipientId,
    });
    if (existingRequest) {
      console.log("Error: Friend request already sent", {
        requesterId,
        recipientId,
      });
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = new FriendRequest({
      requester: requesterId,
      recipient: recipientId,
    });
    await friendRequest.save();

    console.log("Friend request sent successfully", {
      requesterId,
      recipientId,
    });
    return res
      .status(201)
      .json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error("Error sending friend request:", err.message);
    return res.status(500).json({ message: "Error sending friend request" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const recipientId = req.user.id;
  const { requesterEmail } = req.body;

  try {
    const requesterUser = await User.findOne({ email: requesterEmail });
    if (!requesterUser) {
      console.log("Error: Requester user not found", { requesterEmail });
      return res.status(404).json({ message: "User not found" });
    }
    const requesterId = requesterUser._id.toString();

    const friendRequest = await FriendRequest.findOne({
      requester: recipientId,
      recipient: requesterId,
    });
    if (!friendRequest) {
      console.log("Error: Friend request not found", {
        requesterId,
        recipientId,
      });
      return res.status(404).json({ message: "Friend request not found" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friends: requesterId },
    });
    await User.findByIdAndUpdate(requesterId, {
      $addToSet: { friends: recipientId },
    });

    console.log("Friend request accepted", { recipientId, requesterId });
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error accepting friend request:", err.message);
    return res.status(500).json({ message: "Error accepting friend request" });
  }
};

exports.friendCard = async (req, res) => {
  const { friendEmail } = req.query;
  if (!friendEmail) {
    console.log(
      "Error: 'friendEmail' query parameter is required. Example: /friends/cards?friendEmail=example@example.com"
    );
    return res.status(400).json({
      message:
        "friendEmail query parameter is required. Example: /friends/cards?friendEmail=example@example.com",
    });
  }

  try {
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
      console.log(`Error: Friend with email ${friendEmail} not found.`);
      return res.status(404).json({
        message: `Friend with email ${friendEmail} not found.`,
      });
    }

    const friendId = friend._id.toString();
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      console.log(`Error: Current user with ID ${currentUserId} not found.`);
      return res.status(404).json({
        message: `Current user with ID ${currentUserId} not found.`,
      });
    }

    console.log("Current user's friends list:", currentUser.friends);

    // Check if the friend is in the current user's friends list
    const isFriends = currentUser.friends.some(
      (f) => f.toString() === friendId
    );

    if (isFriends) {
      console.log("They are friends. Returning friend's details.");
      // Respond with success message or friend's details if necessary
      return res.status(200).json({ message: "They are friends", friend });
    } else {
      console.log("They are not friends.");
      // Respond with appropriate message
      return res.status(200).json({ message: "They are not friends" });
    }
  } catch (err) {
    // Handle any errors that occur during the process
    console.error("Error fetching friend details:", err.message);
    return res.status(500).json({ message: "Error fetching friend details" });
  }
};
