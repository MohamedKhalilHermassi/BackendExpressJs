const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const user = require('../models/user');
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const config = require('../database/dbConfig.json');
const nodemailer = require('nodemailer');
const orderConfirmationEmailTemplate = require('../template/orderConfirmationEmail');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.email,
        pass: config.email.pwd
    }
  });
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

router.post('/addindiv/:studentid/:teacherid', async (req, res, next) => {
  try {
    console.log(req.body);
    const userfound = await user.findById(req.params.studentid);
    const teacherfound = await user.findById(req.params.teacherid);
    console.log(userfound.email);
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(startDate.getTime() + req.body.duree * 60000);
    console.log("enddate : " ,endDate)
    const sessions = await Session.find();
    const existingSession = sessions.filter(session => {
      const sessionStartDate = new Date(session.startDate);
      return sessionStartDate >= startDate || sessionStartDate <= endDate;
  });
  
    

    console.log(existingSession);

   


    const session = new Session({
      startDate: req.body.startDate,
      endDate: endDate,
      duree: req.body.duree,
      course: req.body.course,
      teacher: req.body.teacher,
      classroom: req.body.classroom,
      level: req.body.level,
      students: []
    });

    await session.save();

    const foundTeacher = await user.findById(req.body.teacher);
    foundTeacher.sessions.push(session._id);
    await foundTeacher.save();
    
      await transporter.sendMail({
        from: config.email.email,
        to: userfound.email,
        subject: 'An individual session has been confirmed',
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                h1 {
                    color: #007bff;
                }
                p {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #888;
                }
            </style>
        </head>
        <body>
        <div>
                <img src="https://elkindy.dal.com.tn/images/Untitled-1.png      ">
            </div>
            <div class="container">
                <h1>Hello ${userfound.fullname},</h1>
                <p>An individual session has been placed on ${req.body.startDate.toLocaleString()} with your teacher ${teacherfound.fullname}. You can check your schedule for more details</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply.</p>
            </div>
        </body>
        </html>
        `
    });
    await transporter.sendMail({
      from: config.email.email,
      to: teacherfound.email,
      subject: 'An individual session has been confirmed',
      html: `
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
              }
              h1 {
                  color: #007bff;
              }
              p {
                  font-size: 16px;
                  line-height: 1.6;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #888;
              }
          </style>
      </head>
      <body>
      <div>
              <img src="https://elkindy.dal.com.tn/images/Untitled-1.png      ">
          </div>
          <div class="container">
              <h1>Hi Mr ${teacherfound.fullname},</h1>
              <p>An individual session has been placed on ${req.body.startDate.toLocaleString()} with your student ${userfound.fullname}. You can check your schedule for more details</p>
          </div>
          <div class="footer">
              <p>This is an automated message, please do not reply.</p>
          </div>
      </body>
      </html>
      `
  });
    
    res.json({ message: 'Session successfully added' });

    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//ADD STATIC 
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

   


    const session = new Session({
      startDate: req.body.startDate,
      endDate: endDate,
      duree: req.body.duree,
      course: req.body.course,
      teacher: req.body.teacher,
      classroom: req.body.classroom,
      level: req.body.level,
      students: []
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



// Define a route to handle the API request for finding available time slots
router.post('/find-available-time', (req, res) => {
  const { teacher, students, sessionDuration } = req.body;

  // Check if all required parameters are provided
  if (!teacher || !students || !sessionDuration) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Logic to find available time slots between teacher and students
  const availableTimeSlots = findAvailableTime(teacher, students, sessionDuration);

  // Respond with the available time slots
  res.json({ availableTimeSlots });
});


router.post('/create-session', async (req, res) => {
  const { startTime, endTime, course, classroom, teacher, students } = req.body;

  // Check if all required parameters are provided
  if (!startTime || !endTime || !course || !classroom || !teacher || !students) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Create a new session
    const newSession = new Session({
      startTime,
      endTime,
      course,
      classroom,
      teacher,
      students
    });

    // Save the session to the database
    await newSession.save();

    // Respond with the created session data
    res.status(201).json({ message: 'Session created successfully', session: newSession });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session. Please try again.' });
  }
});


function findAvailableTime(teacher, students, sessionDuration) {
  const availableTimeSlots = [];

  // Iterate through teacher's availableTime
  teacher.availableTime.forEach(teacherSlot => {
    // Iterate through each student's availableTime
    students.forEach(student => {
      student.availableTime.forEach(studentSlot => {
        // Find overlap duration between teacher's slot and student's slot
        const overlapDuration = calculateOverlapDuration(teacherSlot, studentSlot);

        // If overlap duration is greater than or equal to session duration
        if (overlapDuration >= sessionDuration) {
          // Calculate start and end time of the available time slot
          const startTime = Math.max(teacherSlot.startTime, studentSlot.startTime);
          const endTime = Math.min(teacherSlot.endTime, studentSlot.endTime);

          // Add the available time slot to the result
          availableTimeSlots.push({ startTime, endTime });
        }
      });
    });
  });

  return availableTimeSlots;
}

function calculateOverlapDuration(slot1, slot2) {
  // Calculate overlap duration between two time slots
  const overlapStart = Math.max(slot1.startTime, slot2.startTime);
  const overlapEnd = Math.min(slot1.endTime, slot2.endTime);
  return Math.max(0, overlapEnd - overlapStart);
}



module.exports = router;