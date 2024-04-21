const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const upload = require('../shared/multer');
const user = require('../models/user');

router.get('/', async(req, res, next) => {
    const courses = await Course.find().populate({
        path: 'teacher',
        select : 'fullname'
    });
    res.json(courses);
})

router.get('/:id', async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate('students').populate('teacher');
    res.json(course);
})

router.put('/:id',upload.single('file'),async(req, res, next) =>{
    await Course.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description: req.body.description,
        hourly_based_price: req.body.hourly_based_price,
        courseType: req.body.courseType,
        level: req.body.level,
        teacher: req.body.teacher
    })
    res.json({message: "course updated successfully"})
})

router.delete('/:id', async(req, res, next) => {
    await Course.findByIdAndDelete({_id: req.params.id});
    res.json({'message': 'Course Deleted'})
})

router.post('/add',upload.single('file'), async(req, res, next) => {
    const course = new Course({
        name: req.body.name,
        description: req.body.description,
        hourly_based_price: req.body.hourly_based_price        ,
        image:req.file.filename,
        courseType: req.body.courseType,
        level: req.body.level,
        teacher: req.body.teacher
    });

    await course.save();
    res.json({message: 'Course successfully added'});
})

router.get('/findbyname/:name', async(req, res, next) => {
    const filter = req.params.name;
    const course = await Course.find({name:filter});

    res.json(course[0]);
})

router.get('/coursesByStudent/:id', async(req, res, next) => {
    const courses = await Course.find().populate('teacher');
    const selectedCourses = courses.filter((c) => c.students.includes(req.params.id));
    res.json(selectedCourses)
})

router.get('/coursesByTeacher/:id', async(req, res, next) => {
    const courses = await Course.find({teacher: req.params.id}).populate('students');
    res.json(courses)
})

router.put('/enroll/:courseid/:studentid', async (req, res, next) => {
    const course = await Course.findById(req.params.courseid);
    if (!course.students) {
        course.students = [];
    }
    course.students.push(req.params.studentid);
    await course.save();
    const student = await user.findById(req.params.studentid);
    if (!student.courses) {
        student.courses = [];
    }
    student.courses.push(req.params.courseid);
    await student.save();
    res.json({message: "you have enrolled into this course"});

});
router.put('/unenroll/:courseid/:studentid', async (req, res, next) => {
    try {
        // Find the course by ID
        const course = await Course.findById(req.params.courseid);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Remove the student from the course's students array
        course.students = course.students.filter(studentId => studentId !== req.params.studentid);
        await course.save();

        // Find the student by ID
        const student = await user.findById(req.params.studentid);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Remove the course from the student's courses array
        student.courses = student.courses.filter(courseId => courseId !== req.params.courseid);
        await student.save();

        // Respond with success message
        res.json({ message: "Student unenrolled from the course successfully" });
    } catch (error) {
        console.error("Error unenrolling student from course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// find my courses as a teacher

router.get('/my-courses/:teacherid', async (req, res) => {
    const teacherid = req.params.teacherid;

    try {
        const courses = await Course.find({ 'teacher':teacherid }).populate('students');
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/students-of-course/:courseId', async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const course = await Course.findById(courseId).populate('students');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const students = course.students;
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students of the course:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/add-note/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { courseName, mark } = req.body;
  
    try {
      const userfound = await user.findById(userId);
      if (!userfound) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      userfound.notes.push({ courseName, mark });
      await userfound.save();
  
      res.status(200).json({ message: 'Note added successfully', userfound });
    } catch (error) {
      console.error('Error adding note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/notes/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userfound = await user.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ notes: userfound.notes });
    } catch (error) {
        console.error('Error fetching user notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;