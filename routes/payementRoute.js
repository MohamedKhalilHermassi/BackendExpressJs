const express = require('express');
const router = express.Router();
const user = require('../models/user');
const config = require('../database/dbConfig.json');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
dotenv.config()
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.email,
        pass: config.email.pwd
    }
  });
router.post('/flouci', async (req,res)=>{

const url = "https://developers.flouci.com/api/generate_payment"
const payload={
    "app_token": "8980a869-a509-49d2-bd40-858c75cedad1",
    "app_secret": process.env.FLOUCI_SECRET,
    "accept_card":"true",
    "amount":req.body.amount,
    "success_link": "http://localhost:5173/success",
    "fail_link": "http://localhost:5173/fail",
    "session_timeout_secs": 1200,
    "developer_tracking_id": process.env.DEVELOPER_TRACKING_ID
  }
  

  await axios.post(url,payload).then((result)=>res.send(result.data)).catch((err)=>console.log(err));
        

})
router.get('/verify/:id', async (req,res)=>{

    const id = req.params.id;
    const userid = req.params.userid;
    const userfound = await user.findById(userid);

    url = `https://developers.flouci.com/api/verify_payment/${id}`;

    
   const  headers = {
  'Content-Type': 'application/json',
  'apppublic': '8980a869-a509-49d2-bd40-858c75cedad1',
  'appsecret': process.env.FLOUCI_SECRET
}
    axios.get(url,{headers:headers}).then((result)=>{
        res.send(result.data)
    
    }).catch((err)=>console.log(err.message));

    
    })




router.put('/pay', async (req, res) => {
    try {
        const { userid, type } = req.body;

        // Log the request body to check its contents
        console.log(req.body);

        const userfound = await user.findById(userid);

        // Log the userfound object to check if it's fetched correctly
        console.log(userfound);

        let months = 0;
        if (type === "Annually") {
            months = 12;
        } else if (type === "Trimesterly") {
            months = 3;
        } else if (type === "Monthly") {
            months = 1;
        } else {
            return res.status(400).json({ error: "Invalid payment type" });
        }

        const currentDate = new Date();
        userfound.lastPaymentDate = currentDate;

        const expirePaymentDate = new Date(currentDate);
        expirePaymentDate.setMonth(expirePaymentDate.getMonth() + months);
        userfound.expirePayementDate = expirePaymentDate;
        const expireDate = new Date(userfound.expirePayementDate);
        const formattedExpireDate = expireDate.toLocaleDateString('en-GB');
        
        await transporter.sendMail({
            from: config.email.email,
            to: userfound.email,
            subject: 'Your Membership Has been Renewed',
            html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
                    h1 {
                        color: #007bff;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 14px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
            <div>
                    <img src="https://elkindy.dal.com.tn/images/Untitled-1.png      ">
                </div>
                <div class="container">
                    <h1>Hello ${userfound.fullname},</h1>
                    <p>Thank you for renewing your membership. Your membership is now available until ${formattedExpireDate}.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>
            `
        });
        await userfound.save();

        res.status(200).json({ message: "Payment successful" });
    } catch (err) {
        // Log the error to identify the issue
        console.error(err);
        res.status(500).send(err);
    }
});

  
  module.exports = router;