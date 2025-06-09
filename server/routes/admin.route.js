// routes/admin.routes.js
const router = require('express').Router()
const { verifyToken, isAdmin } = require('../middleware/auth.middleware')
const {
  getAllUsers,
  getAllRewards,
  toggleUserStatus,
  updateUserPoints
} = require('../controllers/admin.controller')

// Routes
router.get('/users', verifyToken, isAdmin, getAllUsers)
router.get('/rewards', verifyToken, isAdmin, getAllRewards)
router.patch('/toggle-status/:userId', verifyToken, isAdmin, toggleUserStatus)
router.patch('/points/:userId', verifyToken, isAdmin, updateUserPoints)


module.exports = router
