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
        lat: req.body.lat,
        lng: req.body.lng,
        numberOfFloors : req.body.numberOfFloors
    })
    
    await location.save()
    res.json({message : "Location added successfully"})
})

router.get('/:id', async (req, res) => {
    const location = await Location.findById(req.params.id);
    res.json(location);
})

module.exports = router;