const express = require('express');
const router = express.Router();
const Location = require('../models/location');

router.get('/', async (req, res, next) => {
    const locations = await Location.find();
    res.json(locations);
})

router.post('/', async (req, res, next) => {
    const location = new Location({
        state : req.body.state,
        city : req.body.city,
        address : req.body.address,
        numberOfFloors : req.body.numberOfFloors
    })
    
    await location.save()
    res.json({message : "Location added successfully"})
})

module.exports = router;