const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const config = require('../database/dbConfig.json');
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const nodemailer = require('nodemailer');
const twilio =require('twilio');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: config.email.email,
      pass: config.email.pwd
  }
});
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
        return res.status(400).json({ message: 'Invalid email or password' });
      }else if (user.status==false) {
        return res.status(403).json({ message: 'Access denied' });
      }
      else if (user.verificationCode!=null) {
        return res.status(401).json({ message: 'Please verify your account' });
      } else {
        const token = jwt.sign({ email: user.email, role: user.role, id:user.id }, config.token.secret, { expiresIn: '1h' });
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
router.post('/register', upload.single('image'), async (req, res) => {
  try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
          return res.status(302).json({ message: 'Email already exists' });
      }

      
      const verificationCode = Math.floor(100000 + Math.random() * 900000); 

      
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
          fullname: req.body.fullname,
          email: req.body.email,
          password: hashedPassword,
          role: "Student",
          adress: req.body.adress,
          phone: req.body.phone,
          birthday: req.body.birthday,
          image: req.file ? req.file.path : null,
          verificationCode: verificationCode 
      });

      
      await transporter.sendMail({
          from: config.email.email,
          to: req.body.email,
          subject: 'Email Verification',
          text: `Hello ${user.fullname}, your account is being set up. To complete your registration, please verify your account. Your verification code is: ${verificationCode}`
        });

         // Send SMS verification (optional)
    if (user.phone) { // Send only if phone number is provided
      try {
        const client = new twilio(config.twilio.id, config.twilio.token);
        const message = `Hello ${user.fullname}, your account is being set up. To complete your registration, please verify your account. Your verification code is: ${verificationCode}`;

        await client.messages.create({
          body: message,
          to: `+216${user.phone}`, // Add country code to phone number
          from: config.twilio.num,
        });

        console.log('SMS verification sent successfully');
      } catch (error) {
        console.error('Error sending SMS verification:', error);
      }
    }
      
      const newUser = await user.save();
      
      res.status(201).json(newUser);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

router.post('/verify-user', async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      if (user.verificationCode !== verificationCode) {
          return res.status(400).json({ message: 'Incorrect verification code' });
      }
      user.verificationCode = null;
      await user.save();
      res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
router.post('/forgetpassword', async (req, res) => {
  const  email   = req.body.email;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const verificationCode = Math.floor(100000 + Math.random() * 900000); 
      user.verificationCode=verificationCode;
      await transporter.sendMail({
        from: config.email.email,
        to: req.body.email,
        subject: 'Forgot Password',
        text: `Hello ${user.fullname},  Your verification code is: ${verificationCode}`
      });

       // Send SMS verification (optional)
  if (user.phone) { // Send only if phone number is provided
    try {
      const client = new twilio(config.twilio.id, config.twilio.token);
      const message = `Hello ${user.fullname}, Your verification code is: ${verificationCode}`;

      await client.messages.create({
        body: message,
        to: `+216${user.phone}`, 
        from: config.twilio.num,
      });

      console.log('SMS verification sent successfully');
    } catch (error) {
      console.error('Error sending SMS verification:', error);
    }
  }
      
      await user.save();
      res.status(200).json({ message: 'successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
router.post('/verify-forgetpassword', async (req, res) => {
  const { email, verificationCode ,password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      if (user.verificationCode !== verificationCode) {
          return res.status(400).json({ message: 'Incorrect verification code' });
      }
      user.verificationCode = null;
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password=hashedPassword;
      await user.save();
      res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
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

module.exports = router