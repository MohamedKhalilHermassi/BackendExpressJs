const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { authenticateToken, authorizeUser } = require('./authMiddleware');
// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }else if (user.status==false) {
        return res.status(403).json({ message: 'Access denied' });
      } else {
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ token });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Getting all
router.get('/AllUsers',authenticateToken,authorizeUser('admin'), async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/OneUser/:email',authenticateToken, getuser, (req, res) => {
  res.json(res.user)
})

// Creating one
router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const  email=req.body.email
  const user = new User({
    fullname: req.body.fullname,
    email: email,
    password: hashedPassword,
    role: "Student",
    adress: req.body.adress,
    phone: req.body.phone,
    birthday: req.body.birthday,
  })
  try {
    if((await User.findOne({ email }))!=null){
        if(user.email==(await User.findOne({ email })).email){
            res.status(302).json({ message: 'email exist' })
        }
    }
   else{
        const newUser = await user.save()
        res.status(201).json(newUser)
    }
    
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Patching One
router.patch('/UpdatingUser/:email',authenticateToken, getuser, async (req, res) => {
  if (req.body.fullname != null) {
    res.user.fullname = req.body.fullname
  }
  if (req.body.email != null) {
    res.user.email = req.body.email
  }
  if (req.body.password != null) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    res.user.password = hashedPassword
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
   if(req.body.email !=null){
    const email =req.body.email
    if((await User.findOne({ email }))!=null){
        if(res.user.email==(await User.findOne({ email })).email){
            res.status(302).json({ message: 'email exist' })
        }
    }
   }else{
    const updatedUser = await res.user.save()
    res.json(updatedUser)
   }
    
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/DeleteOneUser/:email',authenticateToken ,authorizeUser('admin'),getuser, async (req, res) => {
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
    const  email=req.params.email
    user = await User.findOne({ email })
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