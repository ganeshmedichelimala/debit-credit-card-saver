const mongoose = require('mongoose')
const Card = require('./cardModel')
const {Schema} = mongoose



const userSchema = new mongoose.Schema({
  name : {type : String, required : true},
  email : {type : String, required : true, unique : true},
  password : {type : String, required : true},
  friends : [{type : Schema.Types.ObjectId, ref: "User"}]
},{collection : 'users'})


userSchema.pre('remove', async function (next) {
  try {
    // Remove related cards when the user is deleted
    await Card.deleteMany({ user: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema)



module.exports = User