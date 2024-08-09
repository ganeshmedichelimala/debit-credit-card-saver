const mongoose = require('mongoose');

// Define the schema for friend requests
const friendRequestSchema = new mongoose.Schema({
  // The user who sent the friend request
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // The user who will receive the friend request
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // The status of the friend request
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
});

// Create and export the model based on the schema
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
