// controllers/admin.controller.js
const User = require('../models/User')
const Reward = require('../models/Reward')
const { Parser } = require('json2csv')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-passwordHash')
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find()
      .populate('userId', 'name isAdmin email')
      .populate('fromUserId', 'name email')
      .lean()

    const filtered = rewards.filter(r => r.userId && !r.userId.isAdmin)
    const seen = new Set()
    const uniqueKey = (r) =>
      `${r.userId?._id}-${r.fromUserId?._id || 'null'}-${r.level}-${r.points}`

    const unique = filtered.filter(r => {
      const key = uniqueKey(r)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    res.json(unique)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all reward logs' })
  }
}

exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params
    const { isActive } = req.body
    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ message: 'User status updated', user })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

exports.updateUserPoints = async (req, res) => {
  try {
    const { points } = req.body
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.points += points
    await user.save()
    res.json({ message: 'User points updated', newPoints: user.points })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update points' })
  }
}

