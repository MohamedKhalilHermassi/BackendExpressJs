const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroom');

router.get('/', async(res, req, next) =>{
    const classromms = await Classroom.find();
    res.json(classromms);
})

router.post('/add', async(res, req, next) => {
    const classroom = new Classroom({
        location: req.body.location
    })

    await classroom.save();
    res.json({message: 'Classroom successfully added'});
})


module.exports = router;