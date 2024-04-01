const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');

router.get('/', async(req, res, next) =>{
    const classromms = await Classroom.find();
    res.json(classromms);
})

router.post('/', async (req, res, next) => {
    console.log(req.body.floor);
    const classroom = new Classroom({
        number:req.body.number,
        floor:req.body.floor,
        location: req.body.location,
        status: req.body.status,
        type: req.body.type
    })

    await classroom.save();
    res.json({message: 'Classroom successfully added'});
})

router.get('/:locationId', async (req, res) =>{
    console.log(req.params.locationId);
    const classromms = await Classroom.find({location: req.params.locationId});
    console.log(classromms);
    res.json(classromms);
})

router.put('/available/:id', async (req, res) =>{
    await Classroom.findByIdAndUpdate(req.params.id,{status: 'available'});
    res.json({message: 'this classroom is now available to host classes'});
})

router.put('/maintenance/:id', async (req, res) =>{
    await Classroom.findByIdAndUpdate(req.params.id,{status: 'maintenance'});
    res.json({message: 'this classroom is under maintenance'});
})


module.exports = router;