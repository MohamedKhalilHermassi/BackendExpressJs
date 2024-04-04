const express = require('express');
const book = require('../models/books');
const router = express.Router();
const multer = require("multer");
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const user = require('../models/user');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to add a new book
router.post('/add-book', upload.single('image'), async (req, res) => {
  try {
    const bookData = JSON.parse(req.body.book);

    const newBook = new book({
      bookName: bookData.name,
      bookDescription: bookData.description,
      bookPrice: bookData.price,
      Author: bookData.author,
      level: bookData.level,
      filename: req.file.filename,
      archived: false,
    });

    await newBook.save();

    res.status(200).json({ message: 'Book added successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

// Route to get all books
router.get('/get-books', async (req, res) => {
  try {
    const books = await book.find();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to delete a book by ID
router.delete('/delete-book/:id', async (req, res) => {
  try {
    const deletedBook = await book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/buy-book/:id/:userid', async (req, res) => {
    const { id, userid } = req.params;

    try {
        const userfound = await user.findById(userid);

        const bookfound = await book.findById(id);

        if (!user || !book) {
            return res.status(404).send('User or book not found');
        }

        userfound.books.push(bookfound);
        
        await userfound.save();

        res.status(200).send('Book added to user successfully');
    } catch (error) {
        console.error('Error buying book:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/get-my-books/:userid', async (req,res)=>{
  const userid = req.params.userid;

  try{
    const userfound = await user.findById(userid).populate('books');
    const books = userfound.books;
    console.log(books);
    res.status(200).json({books});
  }catch(err)
  {
    console.log("Error getting specific user books",err);
    res.status(500).send("Internal server error");
  }

});

module.exports = router;
