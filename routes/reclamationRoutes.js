const express = require('express');
const router = express.Router();
const Reclamation = require('../models/Reclamation');
const User = require('../models/user');
const config = require('../database/dbConfig.json');
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.email,
        pass: config.email.pwd
    }
  });
//ajouter une réclamation
router.post('/addreclamation', authenticateToken,async (req, res) => {
    try {
      const { email, message } = req.body;
     let user = await User.findOne({ email });
      if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' });
      } 
      if(message==null){
        return res.status(400).json({ message: 'Please enter your message' })
      }
      const reclamation = new Reclamation({
        user: email,
        message: message
    });
    const newrecla = await reclamation.save();
    req.io.emit('reclamationAdded', { message: 'A new claim has been added' });
      res.status(201).json(newrecla);
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
      const reclamations = await Reclamation.find({ user: email });
      res.status(200).json(reclamations);
    } catch (er) {
      res.status(500).json({ message: er.message });
    }
  });
  // Getting all
  router.get('/Allreclamtions/', authenticateToken,authorizeUser('admin'), async (req, res) => {
    try {
      const reclamations = await Reclamation.find();
      res.json(reclamations);
    } catch (er) {
      res.status(500).json({ message: er.message });
    }
  });
  // Deleting One
router.delete('/DeleteOneReclamation/:id',authenticateToken , async (req, res) => {
    try {
        const id = req.params.id;
        let reclamation = await Reclamation.findById({ id });
        if (reclamation == null) {
            return res.status(404).json({ message: 'Cannot find Reclamation' });
          } 
      await reclamation.deleteOne();
      req.io.emit('reclamationdeleated', { message: 'A claim has been deleated' });
      res.json({ message: 'Deleted Reclamation' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  // update One
router.post('/updateReclamation',authenticateToken , async (req, res) => {
    try {
        const id = req.body.id;
        const message = req.body.message;
        let reclamation = await Reclamation.findById({ id });
        if (reclamation == null) {
            return res.status(404).json({ message: 'Cannot find Reclamation' });
          } 
          reclamation.message=message;
          await reclamation.save();
          req.io.emit('reclamationupdated', { message: 'A claim has been modified' });
          res.status(200).json({ message: 'Reclamation updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

   // resolving reclamation
router.post('/resolving/:id',authenticateToken , async (req, res) => {
    try {
        const id = req.params.id;
        let reclamation = await Reclamation.findById({ id });
       
        if (reclamation == null) {
            return res.status(404).json({ message: 'Cannot find Reclamation' });
          } 
          let email=reclamation.user;
          let user = await User.findOne({ email });
          if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
          } 
          reclamation.status='resolved';
          await transporter.sendMail({
            from: config.email.email,
            to: email,
            subject: 'Reclamation Resolved',
            text: `Dear ${user.fullname},

            We are pleased to inform you that your complaint has been successfully resolved. We have investigated your problem and taken the necessary steps to resolve it.
            
            If you have any further questions or concerns, please feel free to contact us at any time. We are here to help you.
            
            Sincerely,
            El kindy`
          });
          await reclamation.save();
          res.status(200).json({ message: 'Reclamation updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  module.exports = router
  