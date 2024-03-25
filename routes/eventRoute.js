const express = require('express');
const router = express.Router();
const Event  = require('../models/event');
const User = require('../models/user');

router.get("/", async(req, res,next) => {
    const events = await Event.find();    
    res.json(events);
});

router.get("/:id", async(req, res, next) => {
    const ev = await Event.findById(req.params.id);
    res.json(ev);
});

router.post('/add',async(req,res) => {
    const event = new Event({
        title:req.body.title,
        description:req.body.description,
        date:req.body.date,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        location:req.body.location,
        capacity:req.body.capacity,
        ticketPrice:req.body.ticketPrice,
        category:req.body.category,
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
    ev.ticketPrice = req.body.ticketPrice;
    ev.category = req.body.category;
    ev.status = req.body.status;
    ev.image = req.body.image;
    await ev.save();
    res.json({message: "Event updated"});
});

router.delete("/delete/:id", async(req, res, next) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({message: "Event deleted"});
});

router.post('/register', async (req, res) => {
    const { userId, eventId } = req.body;
  
    try {
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);
  
      if (!user || !event) {
        return res.status(404).json({ message: 'User or event not found' });
      }
  
      user.events.push(eventId);
      event.users.push(userId);
  
      await Promise.all([user.save(), event.save()]);
  
      return res.status(200).json({ message: 'Successfully registered for event' });
    } catch (error) {
      console.error('Error in /register route:', error);
      return res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
