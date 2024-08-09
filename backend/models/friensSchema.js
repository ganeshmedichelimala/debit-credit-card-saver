const mongoose = require('mongoose')
const { required } = require('../schemas/userRegisterSchema')

const friendsSchema = new mongoose.Schema({
  user1 : {type :mongoose.Schema.Types.ObjectId, ref : "User", required:true},
  user2 : {type :mongoose.Schema.Types.ObjectId, ref : "User", required:true},
  status : {type : String, enum :["requested", "accpeted", "pending"], default : "pending"}
},{timestamps : true});

const Friends = new mongoose.model("Friends", friendsSchema)
module.exports = Friends
