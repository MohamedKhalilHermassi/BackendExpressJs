const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const config = require('../database/dbConfig.json');
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Initialiser l'instance multer avec la configuration de stockage
const upload = multer({ storage: storage });
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
        const token = jwt.sign({ email: user.email, role: user.role, id: user.id }, config.token.secret, { expiresIn: '1h' });
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
router.post('/register',upload.single('image'), async (req, res) => {
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
    events: [],
    image: req.file ? req.file.path : null
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
router.patch('/UpdatingUser/:email',authenticateToken,upload.single('image'), getuser, async (req, res) => {
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
  if(req.file!=null){
    res.user.image =req.file ? req.file.path : null
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
//ban user 
router.put('/BanUser/:email',authenticateToken ,authorizeUser('admin'),getuser, async (req, res) => {
  try {
    res.user.status=!res.user.status
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
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



router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const userWithEvents = await User.findById(userId).populate('events');

    if (!userWithEvents) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userWithEvents);
  } catch (error) {
    console.error('Error fetching user with events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router