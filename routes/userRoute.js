const express = require('express');
const router = express.Router();
var User = require ("../models/user") ;


module.exports = router;



/* GET users listing. */
router.get('/', async(req, res, next) =>{
    const users = await User.find() ;
  
    res.json(users) ;
  });

//add
router.post('/adduser',async(req,res,next)=>{
    const newUser = new User  ({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        role: "Student",
        adress: req.body.adress,
        phone: req.body.phone,
        birthday: req.body.birthday,
    }) ;
    try {
        await newUser.save();
        res.json("User added");
    } catch (error) {
        // Handle errors
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Could not add user" });
    }
   }) ;