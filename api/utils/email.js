const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const config = smtpTransport({
  service: "gmail",
  port: 587,
  secureConnection: true,
  auth: {
    user: "silkyway.enterprise@gmail.com",
    pass: "mjcl afri veba mqgk",
    // pass: process.env.GMAIL_APP_PASS,
  },
});

const transporter = nodemailer.createTransport(config);

const createPurchaseMail = (user, products) => {
  const mail = {
    from: "silkyway.enterprise@gmail.com", // sender address
    to: [user.email],
    subject: "checkout",
    text: "Purchase Confirmation",
    html: `
           <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .product {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .product img {
            max-width: 100px;
            border: 1px solid #dddddd;
            border-radius: 10px;
        }
        .product-info {
            flex-grow: 1;
            padding-left: 20px;
        }
        .product-info h2 {
            margin: 0 0 10px 0;
            font-size: 18px;
        }
        .product-info p {
            margin: 5px 0;
            font-size: 16px;
            color: #555555;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #dddddd;
            font-size: 14px;
            color: #777777;
        }
        @media only screen and (max-width: 600px) {
            .product {
                flex-direction: column;
                align-items: center;
            }
            .product img {
                margin-bottom: 10px;
            }
            .product-info {
                padding-left: 0;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Thank you for your purchase, ${user.firstname}!</h1>
        </div>
        ${products
          .map((p) => {
            return `
                    <div class="product">
                        <img src=${p.images[0]} alt="Product 1 Image">
                        <div class="product-info">
                            <h2>${p.title}</h2>
                            <p>Price: $${p.price}</p>
                        </div>
                    </div>
            `;
          })
          .join("")}
        <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>&copy; 2024 Your SilkyWay</p>
        </div>
    </div>
</body>
</html>

            `, // html body
  };

  return mail;
};

const sendPurchaseMail = async (user, products) => {
  const mail = createPurchaseMail(user, products);
  transporter
    .sendMail(mail)
    .then((info) => console.log("MAIL_INFO =====>", info))
    .catch((err) => console.log(err));
};

module.exports = { sendPurchaseMail };
