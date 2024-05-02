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
router.put('/editCommentaire/:id', async (req, res, next) => {
  try {
    // Find the comment by ID
    let editCommentaire = await Commentaire.findById(req.params.id);
    if (!editCommentaire) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the edited description contains bad words
    if (filter.isProfane(req.body.description)) {
      return res.status(400).json({ message: "Edited comment contains inappropriate language" });
    }

    // Update the description and date
    editCommentaire.description = req.body.description;
    editCommentaire.date_c = new Date();
    
    // Save the updated comment
    await editCommentaire.save();

    res.json("Commentaire updated");
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
  const { score, userId } = req.body; // Assuming userId is provided in the request body
  
  try {
    const comment = await Commentaire.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the comment has already been scored by the same user
    if (comment.updatedBy && comment.updatedBy.toString() === userId) {
      // User has already voted, allow them to change their vote
      comment.score = score;
    } else {
      // Check if the score is being updated by more than 1 point
      if (Math.abs(comment.score - score) !== 1) {
        return res.status(400).json({ message: 'Score can only be updated by 1 point at a time' });
      }
      
      // Update the score of the comment
      comment.score = score;
      comment.updatedBy = userId; // Set the user ID who updated the score
    }

    await comment.save();

    return res.status(200).json({ message: 'Comment score updated successfully', comment });
  } catch (error) {
    console.error('Error updating comment score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Add reply to a comment
router.post('/addReply/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, description } = req.body; // Assuming userId and description are provided in the request body

  try {
    const comment = await Commentaire.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the reply description contains bad words
    if (filter.isProfane(description)) {
      return res.status(400).json({ message: "Reply contains inappropriate language" });
    }

    // Create a new reply
    const reply = {
      user: userId,
      description: description,
      date_c: new Date(),
      course: comment.course, // Assign the same course as the parent comment
      score: 0, // Assuming the initial score for a reply is 0
    };

    // Add the reply to the comment's replies array
    comment.replies.push(reply);

    // Save the updated comment with the new reply
    await comment.save();

    return res.status(201).json({ message: 'Reply added successfully', reply });
  } catch (error) {
    console.error('Error adding reply:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;