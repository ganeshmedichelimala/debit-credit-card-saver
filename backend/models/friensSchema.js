const mongoose = require('mongoose');

// Define the schema for friend relationships
const friendsSchema = new mongoose.Schema({
  // The first user in the friend relationship
  user1: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // The second user in the friend relationship
  user2: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // The status of the friendship
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'pending'], 
    default: 'pending' 
  }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create and export the model based on the schema
const Friend = mongoose.model('Friend', friendsSchema);

module.exports = Friends;
