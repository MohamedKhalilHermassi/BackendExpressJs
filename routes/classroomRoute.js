const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');

router.get('/', async (req, res, next) => {
    const classrooms = await Classroom.find();
    res.json(classrooms);
});

router.post('/add', async (req, res, next) => {
    const classroom = new Classroom({
        floor: req.body.floor,
        location: req.body.location,
    });

    await classroom.save();
    res.json({ message: 'Classroom successfully added' });
});


module.exports = router;