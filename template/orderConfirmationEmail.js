// orderConfirmationEmailTemplate.js

const orderConfirmationEmailTemplate = (userFullName, products, totalPrice) => `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
                text-align: center;
            }
            .order-details {
                margin-top: 20px;
            }
            .product {
                margin-bottom: 10px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            .product-name {
                font-weight: bold;
            }
            .total-price {
                margin-top: 20px;
                text-align: right;
            }
            .product-image {
                display: block;
                margin-bottom: 10px;
                max-width: 100%;
                height: auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
        <img src="https://elkindy.dal.com.tn/images/Untitled-1.png"  class="product-image">

            <h1>Order Confirmed</h1>
            <p>Hello ${userFullName},</p>
            <p>Thank you for purchasing from ElKindy.tn. This is your order:</p>
            <div class="order-details">
                ${products.map(product => `
                    <div class="product">
                        <span class="product-name">${product.productName}</span> - ${product.productPrice} TND
                    </div>
                `).join('')}
            </div>
            <div class="total-price">
                <p>Total Price: ${totalPrice} TND</p>
            </div>
        </div>
    </body>
    </html>
`;

module.exports = orderConfirmationEmailTemplate;
