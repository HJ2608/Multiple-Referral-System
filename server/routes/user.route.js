// routes/user.routes.js
const router = require('express').Router()
const { verifyToken } = require('../middleware/auth.middleware')
const {
  getMe,
  getDownlines,
  getRewardHistory
} = require('../controllers/user.controller')

// Routes
router.get('/me', verifyToken, getMe)
router.get('/downlines', verifyToken, getDownlines)
router.get('/rewards', verifyToken, getRewardHistory)

module.exports = router
