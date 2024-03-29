const express = require('express');
const order = require('../models/order');
const user = require('../models/user');
const router = express.Router();
const { authenticateToken, authorizeUser } = require('./authMiddleware');


router.post('/add-order', async (req, res) => {
try {
    const newOrder = new order({
        date: Date.now(),
        totalPrice: req.body.totalPrice,
        validated: false,
        user: req.body.user,
        products: req.body.products
    });
    const userorder = await user.findById(req.body.user);
    if (!userorder) {
        return res.status(404).json({ message: 'User not found' });
    }
    else
    {
        userorder.orders.push(newOrder._id);
        await userorder.save();
    }
    await newOrder.save();
    res.status(200).json({ message: 'Order added successfully' });
} catch (err) {
    console.error(err);
    res.status(400).send(err.message);
    
}

});

router.get('/get-orders', authenticateToken ,authorizeUser('admin'),async (req, res) => {
    try {
      
        const orders = await order.find().populate({
            path: 'user',
            select: ['-products','-orders']
          }).populate({
            path: 'products',
            select: ['productName','productPrice','filename']
          });
        
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
        
    }
    
    });

module.exports = router;