const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const user = require('../models/user');
const { authenticateToken, authorizeUser } = require('./authMiddleware');

router.get('/', async(req, res, next) => {
    const couSessionrses = await Session.find();
    res.json(couSessionrses);
})
//FIND BY ID
router.get('/:id', async(req, res, next) => {
    const session = await Session.findById(req.params.id);
    res.json(session);
})
// DELETE
router.delete('/:id', async(req, res, next) => {
    await Session.findByIdAndDelete({_id: req.params.id});
    res.json({'message': 'Session Deleted'})
})
// ADD SESSION

router.post('/add',authenticateToken,authorizeUser("teacher"), async(req, res, next) => {
    
  console.log(req.body);
  const session = new Session({
      startDate: req.body.startDate,
      duree: req.body.duree,
      course: req.body.courseId,
      usersId: req.body.usersId
    });
  
    
    try {
      session.users.push(req.body.usersId);
      console.log(req.body.usersId);
      const newUser = await user.findById(req.body.usersId);
      newUser.sessions.push(session._id);
      await session.save();
      await newUser.save();
      res.json({ message: 'Session successfully added' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
//edit

router.put('/:id', async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    session.startDate = req.body.startDate;
    session.duree = req.body.duree;
    session.course = req.body.courseId;

    await session.save();

    res.json("Session updated");
  } catch (error) {
    next(error);  
  }
});
 


module.exports = router;