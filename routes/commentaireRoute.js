const express = require('express');
const router = express.Router();
var Commentaire = require ("../models/commentaire") ;
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const Filter = require('bad-words');
const filter = new Filter();
filter.addWords('bonjour');
/* GET users listing. */
router.get('/', async(req, res, next) =>{
    const commentaires = await Commentaire.find() ;
  
    res.json(commentaires) ;
  });
  // Get all comments for a specific course
router.get('/getcoursescomments/:id', async (req, res) => {
    try {
      const comments = await Commentaire.find({ course: req.params.id }).populate('user');
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //add
  router.post('/course/:id', async (req, res) => {
    // Check if the comment contains bad words
    if (filter.isProfane(req.body.description)) {
      return res.status(400).json({ message: "Comment contains inappropriate language" });
    }
  
    // If no bad words, proceed with adding the comment
    const comment = new Commentaire({
      user: req.body.userId,
      description: req.body.description,
      date_c: new Date(),
      course: req.params.id
    });
  
    try {
      const newComment = await comment.save();
      res.status(201).json(newComment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
   
//edit
router.put('/editCommentaire/:id',async(req,res,next)=> {
    let   editCommentaire =  await Commentaire.findById(req.params.id) ; 
    editCommentaire.description = req.body.description   ;
    editCommentaire.date_c =  new Date();
     editCommentaire.save() ;
   
         res.json("Commentaire updated") ; 
   
   }) ; 

   //delete

router.delete('/delete/:id',async(req,res,next)=> {
    const deleteCommentaire =  await Commentaire.findByIdAndDelete(req.params.id) ; 
     
    res.json("Commmentaire deleted" ) ; 
});


//getParId

router.get('/:id',async (req,res,next)=> {
    const commentaireid = await Commentaire.findById(req.params.id) ;
    res.json(commentaireid) ; 
});

//updatescore
router.put('/updateScore/:id', async (req, res) => {
    const { id } = req.params;
    const { score } = req.body;
  
    try {
      const comment = await Commentaire.findById(id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Update the score of the comment
      comment.score = score;
      await comment.save();
  
      return res.status(200).json({ message: 'Comment score updated successfully', comment });
    } catch (error) {
      console.error('Error updating comment score:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;