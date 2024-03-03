const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const upload = require('../shared/multer');

router.get('/', async(req, res, next) => {
    const courses = await Course.find();
    res.json(courses);
})

router.get('/:id', async(req, res, next) => {
    const course = await Course.findById(req.params.id);
    res.json(course);
})

router.put('/:id',async(req, res, next) =>{
    await Course.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        description: req.body.description,
        hourly_based_price: req.body.price,
        courseType: req.body.courseType,
        level: req.body.level
    })
    res.json({message: "course updated successfully"})
})

router.delete('/:id', async(req, res, next) => {
    await Course.findByIdAndDelete({_id: req.params.id});
    res.json({'message': 'Course Deleted'})
})

router.post('/add',upload.single('file'), async(req, res, next) => {
    console.log(req.file);
    const course = new Course({
        name: req.body.name,
        description: req.body.description,
        hourly_based_price: req.body.price,
        courseType: req.body.courseType,
        level: req.body.level
    });

    await course.save();
    res.json({message: 'Course successfully added'});
})

router.get('/findbyname/:name', async(req, res, next) => {
    const filter = req.params.name;
    const course = await Course.find({name:filter});

    res.json(course[0]);
})



module.exports = router;