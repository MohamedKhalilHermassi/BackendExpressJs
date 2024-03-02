const express = require('express');
const product = require('../models/product');
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    
    // Parse the JSON data from the form field
    const productData = JSON.parse(req.body.product);

    // Create a new product object
    const newProduct = new product({
      productName: productData.name,
      productDescription: productData.description,
      productPrice: productData.price,
      productCondition: productData.condition,
      productType:productData.type,
      productAvailability: true,
      filename: req.file.filename, 

      // Assuming you want to store the filename in your product model
      // Other file metadata such as contentType can also be included here if needed
    });
    

    // Save the product to the database
    await newProduct.save();
    
    res.status(200).json({"message":"product added successfully"});
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/get-products',async(req,res)=>{
try{

const products = await product.find();
res.status(200).json(products);


}catch(err)
{
  res.status(400).send(err.message);
}
})

module.exports = router;
