const express = require('express');
const router = express.Router();
var Commentaire = require ("../models/commentaire") ;
/* GET users listing. */
router.get('/', async(req, res, next) =>{
    const commentaires = await Commentaire.find() ;
  
    res.json(commentaires) ;
  });

  //add
router.post('/addcommentaire',async(req,res,next)=>{
    const newCommentaire = new Commentaire  ({
        user: req.body.userId,
        description : req.body.description ,
        date_c: new Date() 
    }) ;
    await newCommentaire.save(); 
      res.json("commentaire add") ;
   }) ;
   
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

module.exports = router;