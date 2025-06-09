const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  referralCode: { type: String, unique: true, index:true },
  referredBy: String,
  uplines: [String], // referralCodes
  points: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isActive: {type:Boolean, default: true}
});

module.exports = mongoose.model('User', userSchema);
