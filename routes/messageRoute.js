const express = require('express');
const router = express.Router();
const Message = require('../models/message'); 



router.post('/send-message', async (req, res) => {
  try {
    const { senderId, content } = req.body;
    const message = new Message({
      senderId,
      content
    });
    await message.save();

    console.log('Message saved:', message);


    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
    console.log(error);
  }
});

router.get('/get-all',async (req,res)=>{
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).send("Internal Server Error")
        
    }
})

module.exports = router;