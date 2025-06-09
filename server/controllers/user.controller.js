// controllers/user.controller.js
const User = require('../models/User')
const Reward = require('../models/Reward')

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getDownlines = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const referrals = await User.find({ referredBy: user.referralCode })
    res.status(200).json(referrals)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getRewardHistory = async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.user.id })
      .populate('fromUserId', 'name email')
    res.json(rewards)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rewards' })
  }
}
