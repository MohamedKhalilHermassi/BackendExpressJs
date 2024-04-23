const express = require('express');
const router = express.Router();
const Reclamation = require('../models/Reclamation');
const User = require('../models/user');
const config = require('../database/dbConfig.json');
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.email,
        pass: config.email.pwd
    }
  });
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reclamtions') 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  
  // Initialiser l'instance multer avec la configuration de stockage
  const upload = multer({ storage: storage });
  module.exports = (io)=>{
    //ajouter une réclamation
    router.post('/addreclamation', authenticateToken, upload.array('images'), async (req, res) => {
      try {
        const { email, message, typereclamtion, otherreclamtion } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'Cannot find user' });
        } 
        if (!message) {
          return res.status(400).json({ message: 'Please enter your message' });
        }
    
        let files = null;
        if (req.files && req.files.length > 0) {
          files = req.files.map(file => file.path);
        }
    
        const reclamation = new Reclamation({
          user: user._id,
          message: message,
          typereclamtion: typereclamtion,
          otherreclamtion: typereclamtion === 'other' ? otherreclamtion : null,
          files: files,
        });
    
        const newReclamation = await reclamation.save();
        io.emit('Reclamation', `${user.fullname} has added a new claim: ${newReclamation.message}`);
        res.status(201).json(newReclamation);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    

// Getting all reclamtions for one user  
router.get('/Allreclamtions/:email', authenticateToken, async (req, res) => {
  try {
      const email = req.params.email;
      let user = await User.findOne({ email });
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    } 
    let id =user._id;
    const reclamations = await Reclamation.find({  user:id });
    res.status(200).json(reclamations);
  } catch (er) {
    res.status(500).json({ message: er.message });
  }
});
// Getting all
router.get('/Allreclamtions/', authenticateToken,authorizeUser('admin'), async (req, res) => {
  try {
    const reclamations = await Reclamation.find().populate('user');
    res.json(reclamations);
  } catch (er) {
    res.status(500).json({ message: er.message });
  }
});
// Deleting One
router.delete('/DeleteOneReclamation/:id',authenticateToken , async (req, res) => {
  try {
      const _id = req.params.id;
      let reclamation = await Reclamation.findById({ _id });
      if (reclamation == null) {
          return res.status(404).json({ message: 'Cannot find Reclamation' });
        } 
        let user= await  User.findById(reclamation.user);
    await reclamation.deleteOne();
    io.emit('Reclamation',`${user.fullname} have deleted the claim : ${reclamation.message}`);
    res.json({ message: 'Deleted Reclamation' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// update One
router.post('/updateReclamation', authenticateToken, upload.array('images'), async (req, res) => {
  try {
    const { id, message, typereclamtion, otherreclamtion } = req.body;
    let reclamation = await Reclamation.findById(id);
    
    if (!reclamation) {
      return res.status(404).json({ message: 'Cannot find Reclamation' });
    } 
    if (message) reclamation.message = message;
    if (typereclamtion) reclamation.typereclamtion = typereclamtion;
    if (otherreclamtion && typereclamtion === 'other') reclamation.otherreclamtion = otherreclamtion;
    else  reclamation.otherreclamtion =null;

    await reclamation.save();

    let user = await User.findById(reclamation.user);
    io.emit('Reclamation', `${user.fullname} has edited the claim: ${reclamation.message}`);
    
    res.status(200).json({ message: 'Reclamation updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});


 // resolving reclamation
router.post('/resolving/:id',authenticateToken , async (req, res) => {
  try {
      let _id = req.params.id;
      let resp=req.body.resp;
      let reclamation = await Reclamation.findById({ _id });
     
      if (reclamation == null) {
          return res.status(404).json({ message: 'Cannot find Reclamation' });
        } 
        _id=reclamation.user;
        let user = await User.findById({ _id });
        if (user == null) {
          return res.status(404).json({ message: 'Cannot find user' });
        } 
        reclamation.status='resolved';
        reclamation.resopnseReclamtion=resp;
        await transporter.sendMail({
          from: config.email.email,
          to: user.email,
          subject: 'Reclamation Resolved',
          html: `
          <html>
            <body>
              <div style="text-align: center;">
                <img src="https://i.postimg.cc/tTwcJth6/271796769-2289709331167054-5184032199602093363-n.jpg" alt="Header Image">
              </div>
              <div>
                <h2>Dear ${user.fullname}</h2>
                <p>${resp}</p>
                <p>Sincerely,</p>
                <p>El kindy</p>
              </div>
            </body>
          </html>
        `});
        await reclamation.save();
        res.status(200).json({ message: 'Reclamation updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/addreclamationtest', async (req, res) => {
  try {
    const { message, typereclamtion } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Please enter your message' });
    }
    const reclamation = new Reclamation({
      message: message,
      typereclamtion: typereclamtion,
    });
    const newReclamation = await reclamation.save();
    res.status(201).json(newReclamation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete('/DeleteOneReclamationtest/:id' , async (req, res) => {
  try {
      const _id = req.params.id;
      let reclamation = await Reclamation.findById({ _id });
      if (reclamation == null) {
          return res.status(404).json({ message: 'Cannot find Reclamation' });
        } 
    await reclamation.deleteOne();
    res.json({ message: 'Deleted Reclamation' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
return router
  }
  