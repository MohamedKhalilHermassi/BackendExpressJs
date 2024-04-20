const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// POST endpoint to create a new transaction
router.post('/add', async (req, res) => {
  try {
    // Extract data from request body
    const { userid, cardNumber, type } = req.body;
    let tot = 0;
    console.log("type is : ",type);
    if(type=="Annually")
    {
        tot=650;
    }
   else  if(type=="Trimesterly")
    {
        tot=175;
    }
   else  if(type=="Monthly")
    {
        tot=60;
    }
    const newTransaction = new Transaction({
    userid,
      cardNumber,
      total:tot,
      type
    });

    await newTransaction.save();

    res.status(201).json({ success: true, message: 'Transaction created successfully', data: newTransaction });
  } catch (error) {
    // Handle errors
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to create transaction' });
  }
});

router.get('/all', async (req, res) => {
    try {
      const transactions = await Transaction.find(); 
      res.status(200).json({ success: true, data: transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
    }
  });

module.exports = router;
