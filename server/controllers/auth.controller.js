const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Reward = require('../models/Reward')


const generateReferralCode = () => Math.random().toString(36).substr(2, 8)

const rewardDistribution = [10, 5, 4, 3, 3, 1, 1, 1, 1] // 1st to 9th upline

exports.registerUser = async (req, res) => {
  const { name, phone, email, password, referralCode } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    let newReferralCode;
    do {
      newReferralCode = generateReferralCode();  
    } while (await User.exists({ referralCode: newReferralCode }));

    let uplines = []
    let uplineCode = referralCode
    for (let i = 0; i < 9 && uplineCode; i++) {
      const uplineUser = await User.findOne({ referralCode: uplineCode })
      if (!uplineUser) break
      uplines.push(uplineUser.referralCode)
      uplineCode = uplineUser.referredBy
    }

    const newUser = await User.create({
      name,
      phone,
      email,
      passwordHash,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
      uplines,
      points: 20
    })

    // Reward uplines
    for (let i = 0; i < uplines.length; i++) {
      const points = rewardDistribution[i]
      const uplineUser = await User.findOne({ referralCode: uplines[i] })

      if (uplineUser) {
        uplineUser.points += points
        await uplineUser.save()

        await Reward.create({
          userId: uplineUser._id,
          fromUserId: newUser._id,
          level: i + 1,
          points
        })
      }
    }
    await Reward.create({
      userId: newUser._id,
      fromUserId: newUser._id,
      level: 0,
      points: 20
    })


    res.status(201).json({ message: 'User registered', userId: newUser._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'User not found' })

    const validPass = await bcrypt.compare(password, user.passwordHash)
    if (!validPass) return res.status(400).json({ error: 'Invalid password' })

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2d' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        points: user.points,
        isAdmin: user.isAdmin,
        isActive: user.isActive
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
