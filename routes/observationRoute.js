const express = require('express');
const router = express.Router();
const Observation = require('../models/observation');
const User = require('../models/user');

router.post('/add-observation/:userid', async (req, res) => {
    const userid = req.params.userid;

    try {
      const observation = new Observation({
        userid: userid,
        mark:req.body.mark,
        remark:req.body.remark,


      });
      await observation.save();
  
      console.log('observation saved:', observation);
  
  
      res.status(200).json({ success: true, message: 'observation sent successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to send observation' });
      console.log(error);
    }
  });
  router.get('/getbyid/:id',async(req,res)=>{
    const id = req.params.id;
    try {
        const obseravtions = await Observation.findById(id);
        res.status(200).json(obseravtions);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send observation' });

    }
})

router.get('/:userid',async(req,res)=>{
    const userid = req.params.userid;
    try {
        const obseravtions = await Observation.find({userid:userid});
        res.status(200).json(obseravtions);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send observation' });

    }
})

module.exports = router;
