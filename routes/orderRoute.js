const express = require('express');
const order = require('../models/order');
const user = require('../models/user');
const Product = require('../models/product');
const router = express.Router();
const { authenticateToken, authorizeUser } = require('./authMiddleware');
const config = require('../database/dbConfig.json');
const nodemailer = require('nodemailer');
const { productCondition } = require('../shared/enums');
const orderConfirmationEmailTemplate = require('../template/orderConfirmationEmail');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.email,
        pass: config.email.pwd
    }
  });

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
        } else {
            userorder.orders.push(newOrder._id);
            await userorder.save();
        }
        
        // Update each product in the newOrder
        newOrder.products.forEach(async product => {
            // Assuming you have a model named Product
            const updatedProduct = await Product.findByIdAndUpdate(product._id, { sold: true }, { new: true });
            await updatedProduct.save();
        });

        await newOrder.save();


        await newOrder.populate('products');

        await transporter.sendMail({
            from: config.email.email,
            to: userorder.email,
            subject: 'Order Confirmed',
            html: orderConfirmationEmailTemplate(userorder.fullname, newOrder.products, newOrder.totalPrice)

        });
        
        


        res.status(200).json({ message: 'Order added successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});

router.get('/get-orders', authenticateToken ,authorizeUser('admin'), async (req, res) => {
    try {
        const orders = await order.find().populate({
            path: 'user',
            select: ['-products', '-orders']
        }).populate({
            path: 'products',
            select: ['productName', 'productPrice', 'filename']
        });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});


router.get('/get-my-orders/:userid' ,authenticateToken, async (req, res) => {
    try {
        const userid = req.params.userid
        const foundUser = await user.findById(userid).populate({
            path: 'orders',
            populate: {
                path: 'products'
            }
        });       
         const orders = foundUser.orders;

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});

module.exports = router;