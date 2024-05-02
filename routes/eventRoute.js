const express = require('express');
const router = express.Router();
const Event  = require('../models/event');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const config = require('../database/dbConfig.json');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');
const mongoose = require('mongoose');

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
    const { userId, eventId, tickets } = req.body;
  
    try {
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);
  
      if (!user || !event || !tickets || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(404).json({ message: 'Invalid or missing user ID, event ID, or tickets' });
      }
      for (let i = 0; i < tickets; i++) {
      user.events.push(eventId);
      event.users.push(userId);
      }
      // Increase the number of participants by the number of tickets
      event.participants += Number(tickets);
  
      await Promise.all([user.save(), event.save()]);
      
      const ticketPaths = [];
      for (let i = 0; i < tickets; i++) {
        const ticketId = `${userId}-${eventId}-${new Date().getTime()}-${i}`;

        const qrCodeData = await QRCode.toDataURL(ticketId);

        const doc = new PDFDocument();

        const ticketPath = `./tickets/${ticketId}.pdf`;

        doc.pipe(fs.createWriteStream(ticketPath));

    doc.image('./elkindy_logo.jpg', 50, 50, { width: 150 });
    doc.fontSize(25).text('Event Ticket', 220, 50);

    doc.fontSize(16).text(`Event: ${event.title}`, 50, 150);
    doc.text(`Date: ${event.date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`, 50, 175);
    doc.text(`Location: ${event.location}`, 50, 200);

    //doc.text(`Name: ${user.fullname}`, 50, 250);
    //doc.text(`Email: ${user.email}`, 50, 275);

    doc.image(qrCodeData, 320, 150, { width: 200 });

    doc.fontSize(12).text('Please bring this ticket with you to the event.', 50, 350);

    doc.end();

    ticketPaths.push({
      filename: `${ticketId}.pdf`,
      path: ticketPath
    });
  }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.email,
        pass: config.email.pwd
      }
    });

    // Send an email with the ticket
    let info = await transporter.sendMail({
      from: config.email.email,
      to: user.email,
      subject: 'Event Registration Confirmation',
      html: `<div style="font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Dear ${user.fullname},</h2>

      <p>Congratulations! You have successfully registered for the event "${event.title}".</p>

      <h3>Event Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${event.title}</li>
        <li><strong>Date:</strong> ${event.date}</li>
        <li><strong>Location:</strong> ${event.location}</li>
      </ul>

      <p>Please find attached your event ticket. Make sure to bring it with you to the event.</p>

      <p>If you have any questions, feel free to reply to this email.</p>

      <p>Best regards,</p>
    </div>`, 
      attachments: ticketPaths
    });

      return res.status(200).json({ message: 'Successfully registered for event' });
    } catch (error) {
      console.error('Error in /register route:', error);
      return res.status(500).json({ message: 'Server error' });
    }
});


router.get('/user/:userId/events', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const userWithEvents = await User.findById(userId).populate('events');
  
      if (!userWithEvents) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(userWithEvents.events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/event/:eventId/users', async (req, res) => {
    const { eventId } = req.params;
  
    // Check if eventId is undefined or not a valid ObjectId
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid or missing event ID' });
    }
  
    try {
      const event = await Event.findById(eventId).populate('users');
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Create a new array of users with ticket counts
      const usersWithTickets = event.users.map(user => {
        const tickets = event.users.filter(u => u._id.toString() === user._id.toString()).length;
        return { ...user._doc, tickets };
      });
  
      // Remove duplicates
      const uniqueUsersWithTickets = Array.from(new Set(usersWithTickets.map(user => user._id.toString())))
        .map(id => usersWithTickets.find(user => user._id.toString() === id));
  
      return res.status(200).json(uniqueUsersWithTickets);
    } catch (error) {
      console.error('Error in /event/:eventId/users route:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/cancel', async (req, res) => {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
        return res.status(404).json({ error: 'Event or User not found' });
    }

    const userIndex = event.users.indexOf(userId);
    const eventIndex = user.events.indexOf(eventId);

    if (userIndex === -1 || eventIndex === -1) {
        return res.status(400).json({ error: 'User is not a participant of this event' });
    }

    event.users.splice(userIndex, 1);
    user.events.splice(eventIndex, 1);

    await event.save();
    await user.save();

    res.json({ message: 'Successfully cancelled participation in the event' });
});

router.post('/rate', async (req, res) => {
  const { eventId, userId, rating } = req.body;

  const event = await Event.findById(eventId);
  const user = await User.findById(userId);

  if (!event || !user) {
    return res.status(404).json({ error: 'Event or User not found' });
  }

  // Check if the user has already rated the event
  const existingRating = event.ratings.find(r => r.user.toString() === userId);
  if (existingRating) {
    // Update the existing rating
    existingRating.rating = rating;
  } else {
    // Add a new rating
    event.ratings.push({ user: userId, rating });
  }

  await event.save();

  res.json({ message: 'Rating added successfully' });
});

router.get('/admin/ratings', async (req, res) => {
  try {
    // Fetch all events
    const events = await Event.find().populate('ratings.user');

    // Calculate rating statistics for each event
    const eventRatings = events.map(event => {
      const ratings = event.ratings.map(rating => rating.rating);
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 ? (ratings.reduce((a, b) => a + b) / totalRatings).toFixed(2) : 0;

      // Calculate rating distribution dynamically
      const maxRating = 5;
      const ratingDistribution = Array(maxRating).fill(0);
      ratings.forEach(rating => {
        if (rating > 0 && rating <= maxRating) {
          ratingDistribution[rating - 1]++;
        }
      });

      return {
        eventId: event._id, 
        eventName: event.title, 
        averageRating, 
        totalRatings, 
        ratingDistribution 
      };
    });

    res.json(eventRatings);
  } catch (error) {
    console.error('Error fetching event ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
