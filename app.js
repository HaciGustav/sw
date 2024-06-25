const express = require("express");
const app = express();
const cors = require("cors");
//IMPORTS FOR SESSION TRACKING
const cookieParser = require("cookie-parser");

const router = express.Router();
// SWAGGER IMPORTS
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");

const { connectDB } = require("./api/config/db");

//CONTROLLERS
const { auth } = require("./api/controllers/auth.controller");
const { category } = require("./api/controllers/category.controller");
const { products } = require("./api/controllers/product.controller");
const { sendPurchaseMail } = require("./api/utils/email");

const PORT = process.env.PORT || 8080;
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static("./public"));
app.enable('trust proxy');
app.use("*.css", (req, res, next) => {
  res.set("Content-Type", "text/css");
  next();
});

//*AUTH
router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/auth/logout", auth.logoutUser);

//*PRODUCT
// router.get("/products", auth.authenticateJWT, products.getAllProducts);
router.get("/products", products.getAllProducts);
router.get("/products/getProductsByFilter", products.getProductsByFilter);

router.post("/products", products.createProduct);
router.post("/products/checkout", products.checkout);

router.put("/products", products.updateProduct);

router.delete("/products/:id", products.deleteProduct);

router.patch("/products/:id", products.modifyProduct);

//*CATEGORIES
router.get("/categories", category.getCategories);

router.post("/categories", category.createCategory);

// app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

//SWAGGER
const options = {
  customCssUrl: "/styles/swagger-ui.css",
};

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));
app.use("/api", router);

connectDB();

app.listen(PORT, host="0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}/ `);
});

module.exports = app;
