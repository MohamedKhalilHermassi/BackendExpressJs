const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const user = require('../models/user');
const { authenticateToken, authorizeUser } = require('./authMiddleware');

router.get('/', async(req, res, next) => {
    const couSessionrses = await Session.find().populate({ 
      path: 'classroom', 
      populate: {
        path: 'location'
      }
    }).populate('course');
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

router.post('/add', async (req, res, next) => {
  try {
    console.log(req.body);

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(startDate.getTime() + req.body.duree * 60000);
    console.log("enddate : " ,endDate)
    const sessions = await Session.find();
    const existingSession = sessions.filter(session => {
      const sessionStartDate = new Date(session.startDate);
      return sessionStartDate >= startDate || sessionStartDate <= endDate;
  });
  
    

    console.log(existingSession);

    if (existingSession.length>0) {
      return res
        .status(400)
        .json({ message: 'Session already exists in the classroom within the given time interval' });
    }

    const users = await user.find({ role: 'Student', level: req.body.level });

    const session = new Session({
      startDate: req.body.startDate,
      endDate: endDate,
      duree: req.body.duree,
      course: req.body.course,
      teacher: req.body.teacher,
      classroom: req.body.classroom,
      level: req.body.level,
      students: users
    });

    await session.save();

    const foundTeacher = await user.findById(req.body.teacher);
    foundTeacher.sessions.push(session._id);
    await foundTeacher.save();

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

    // Associate student with session
    session.users.push(req.params.studentid);
    await session.save();

    // Associate session with student
    student.sessions.push(req.params.sessionid);
    await student.save();

    res.json({ message: "Student enrolled into the session successfully" });
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