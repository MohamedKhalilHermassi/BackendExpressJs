const express = require('express');
const router = express.Router();
const Event  = require('../models/event');

router.get("/", async(req, res,next) => {
    const events = await Event.find();    
    res.json(events);
});

router.get("/:id", async(req, res, next) => {
    const ev = await Event.findById(req.params.id);
    res.json(ev);
});

router.post('/add',async(req,res,next) => {
    const event = new Event({
        title:req.body.title,
        description:req.body.description,
        date:req.body.date,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        location:req.body.location,
        capacity:req.body.capacity,
        status:req.body.status,
        image: req.body.image,
        
    });
    await event.save();
    res.json({message: 'Event added'});
});

router.put("/edit/:id",async(req, res, next) => {
    const ev = await Event.findById(req.params.id);
    ev.title = req.body.title;
    ev.description = req.body.description;
    ev.date = req.body.date;
    ev.startTime = req.body.startTime;
    ev.endTime = req.body.endTime;
    ev.location = req.body.location;
    ev.capacity = req.body.capacity;
    ev.status = req.body.status;
    ev.image = req.body.image;
    await ev.save();
    res.json({message: "Event updated"});
});

router.delete("/delete/:id", async(req, res, next) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({message: "Event deleted"});
});



module.exports = router;
