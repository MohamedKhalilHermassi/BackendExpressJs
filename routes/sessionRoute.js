const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const user = require('../models/user');
const config = require('../database/dbConfig.json');

const { authenticateToken, authorizeUser } = require('./authMiddleware');
const e = require('express');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: config.email.email,
      pass: config.email.pwd
  }
});
router.get('/', async(req, res, next) => {
    const couSessionrses = await Session.find().populate({path:'users',select:['fullname']});
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

router.post('/add3',authenticateToken,authorizeUser("teacher"), async(req, res, next) => {
    
  console.log(req.body);
  const session = new Session({
      startDate: req.body.startDate,
      duree: req.body.duree,
      course: req.body.courseId,
      classroom: req.body.classroomId,
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
  //ADD2
  router.post('/add2', authenticateToken, authorizeUser("teacher"), async (req, res, next) => {
    const { startDate, duree, courseId, classroomId } = req.body;

    // Convert start date string to Date object
    const sessionStartDate = new Date(startDate);
    // Calculate end date based on start date and duration
    const sessionEndDate = new Date(sessionStartDate.getTime() + (duree * 60000)); // Convert duree to milliseconds

    try {
        // Check for overlapping sessions
        const existingSession = await Session.findOne({
            classroom: classroomId,
            $or: [
                {
                    startDate: { $lt: sessionEndDate },
                    endDate: { $gt: sessionStartDate }
                },
                {
                    startDate: { $gte: sessionStartDate, $lt: sessionEndDate }
                },
                {
                    endDate: { $gt: sessionStartDate, $lte: sessionEndDate }
                }
            ]
        });

        if (existingSession) {
            return res.status(400).json({ message: 'The selected classroom is already booked at the specified time.' });
        }

        const session = new Session({
            startDate: sessionStartDate,
            endDate: sessionEndDate,
            duree: duree,
            course: courseId,
            classroom: classroomId,
            usersId: req.body.usersId
        });

        // Update user's sessions
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
//ADD3


router.post('/add',authenticateToken,authorizeUser("teacher"), async(req, res, next) => {
  const { startDate, duree, courseId, classroomId } = req.body;
  const sessionStartDate = new Date(startDate);

  const sessionEndDate = new Date(sessionStartDate.getTime() + (duree * 60000));
 




    try {

      const existingSession = await Session.findOne({
        classroom: classroomId,
        $or: [
          {
              startDate: { $lt: sessionEndDate },
              endDate: { $gt: sessionStartDate }
          },
          {
              startDate: { $gte: sessionStartDate, $lt: sessionEndDate }
          },
          {
              endDate: { $gt: sessionStartDate, $lte: sessionEndDate }
          }
      ]
    });
    if (existingSession) {
      console.log(sessionEndDate.toDateString())
      console.log(existingSession.startDate.getTime() + (duree * 60000) === sessionEndDate.getTime())
      console.log(existingSession.startDate)

      if (existingSession.startDate && (existingSession.startDate.getTime() + (duree * 60000) === sessionEndDate.getTime())) {
          return res.status(400).json({ message: 'The selected classroom is already booked at the specified time.' });
      }
  }
      const session = new Session({
        startDate: req.body.startDate,
        duree: req.body.duree,
        course: req.body.courseId,
        classroom: req.body.classroomId,
        usersId: req.body.usersId
      });

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
 //affect USER to Session
 router.put('/join/:sessionid/:studentid', async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.sessionid);
    const student = await user.findById(req.params.studentid);

    if (!session || !student) {
      return res.status(404).json({ message: "Session or student not found" });
    }
   if  (student.sessions.includes(req.params.sessionid))
   {
    res.json({ message: "Student already enrolled into the session" })   ;
   }
   else {

  
    // Associate student with session
    session.users.push(req.params.studentid);
    await session.save();

    // Associate session with student
    student.sessions.push(req.params.sessionid);
    await student.save();
    await transporter.sendMail({
      from: config.email.email,
      to: student.email,
      subject: 'Session Joined',
      text: `Hello ${student.fullname}, You have joined the session of ${session.startDate}`

  });
    res.json({ message: "Student enrolled into the session successfully" });
  }
  
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add a new route to fetch session data by course ID
router.get('/bycourse/:courseid', async (req, res, next) => {
  try {
    const sessions = await Session.find({ course: req.params.courseid });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions by course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;