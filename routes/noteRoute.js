const express = require('express');
const router = express.Router();
const Note = require('../models/notes');

router.get('', async (req, res)=>{
    const notes = await Note.find();
    res.json(notes);
})

router.post('/addproductnote',async (req, res) =>{
    const note = new Note({
        userid : req.body.userid,
        productid : req.body.productid,
        note: req.body.note
    });
    await note.save();
    res.json({message: "note added successfully"});
})

router.post('/addbooknote',async (req, res) =>{
    const note = new Note({
        userid : req.body.userid,
        bookid : req.body.bookid,
        note: req.body.note
    });
    await note.save();
    res.json({message: "note added successfully"});
})

router.post('/addcoursenote',async (req, res) =>{
    const note = new Note({
        userid : req.body.userid,
        courseid : req.body.courseid,
        note: req.body.note
    });
    await note.save();
    res.json({message: "note added successfully"});
})

router.put('/updatenote/:id',async (req, res) =>{
    await Note.findByIdAndUpdate(req.params.id,{
        note: req.body.note
    });
    res.json({message: "note updated successfully"});
})

module.exports = router;