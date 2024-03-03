const express = require('express');
const product = require('../models/product');
const router = express.Router();
const multer = require("multer");
const User = require('../models/user');
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
      productType: productData.type,
      productAvailability: false,
      filename: req.file.filename,
      archived: false,
      user: productData.user, // Assign the user's ID to the product's user field
    });

    // Save the product to the database
    await newProduct.save();

    // Find the user who added the product
    const user = await User.findById(productData.user);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the newly created product's ObjectId to the user's products array
    user.products.push(newProduct._id);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
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


// PUT route to update product availability
router.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { productAvailability } = req.body;

    // Validate if productId is provided and productAvailability is a boolean value
    if (!productId || typeof productAvailability !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Find the product by ID and update its availability
    const updatedproduct = await product.findByIdAndUpdate(productId, { productAvailability }, { new: true });

    // If product is not found, return 404 error
    if (!updatedproduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the updated product
    res.json(updatedproduct);
  } catch (error) {
    console.error('Error updating product availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/archiveProducts/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { archived } = req.body;

    // Validate if productId is provided and archived is a boolean value
    if (!productId || typeof archived !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Find the product by ID and update its archived status
    const updatedProduct = await product.findByIdAndUpdate(productId, { archived }, { new: true });

    // If product is not found, return 404 error
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the updated product
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product archived status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
