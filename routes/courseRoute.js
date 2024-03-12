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
    const course = await Course.findById(req.params.id);
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

})



module.exports = router;