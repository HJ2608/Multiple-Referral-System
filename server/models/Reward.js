const mongoose = require('mongoose')

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },      // who received the points
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // who triggered the reward
  level: Number,
  points: Number,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Reward', rewardSchema)
