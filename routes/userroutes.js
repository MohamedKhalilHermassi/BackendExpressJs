const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
// Getting all
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getuser, (req, res) => {
  res.json(res.user)
})

// Creating one
router.post('/', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    adress: req.body.adress,
    phone: req.body.phone,
    birthday: req.body.birthday,
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getuser, async (req, res) => {
  if (req.body.fullname != null) {
    res.user.fullname = req.body.fullname
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }
  if (req.body.password != null) {
    res.user.password = req.body.password
  }
  if (req.body.role != null) {
    res.user.role = req.body.role
  }
  if (req.body.adress != null) {
    res.user.adress = req.body.adress
  }
  if (req.body.phone != null) {
    res.user.phone = req.body.phone
  }
  if (req.body.birthday != null) {
    res.user.birthday = req.body.birthday
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getuser, async (req, res) => {
  try {
    await res.user.deleteOne()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getuser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

module.exports = router