const Product = require("../models/product.model");
const Category = require("../models/category.model");
const { assignID, convertCurrency } = require("../utils/helpers");
const { auth } = require("./auth.controller");
const { sendPurchaseMail } = require("../utils/email");

//* GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  const filter = {};
  try {
    if (!auth.checkToken(req, res)) {
      filter.isIllegal = false;
    }
    const data = await Product.find(filter).select("-_id -__v");

    const edited = await convertCurrency(data);

    // console.log(edited);
    res.json(edited);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//* GET filtered products
const getProductsByFilter = async (req, res) => {
  const { priceRange, category, title, tag, id } = req.query;

  if (!priceRange && !category && !title && !tag && !id) {
    return res
      .status(400)
      .json({ message: "At least one filter parameter must be provided" });
  }

  let filters = {};

  if (!auth.checkToken(req, res)) {
    filters.isIllegal = false;
  }

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({
        message:
          "Invalid priceRange format. Expected format: minPrice-maxPrice",
      });
    }
    filters.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (category) {
    const categoryExists = await Category.findOne({ name: category }).exec();
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: `Category ${category} does not exist` });
    }
    filters.category = category;
  }

  if (title) {
    filters.title = { $regex: title, $options: "i" }; // Case insensitive regex search
  }
  if (id) {
    filters.id = id;
  }

  if (tag) {
    filters.tags = { $in: [tag] };
  }

  try {
    const data = await Product.find(filters).select("-_id -__v");
    const edited = await convertCurrency(data);
    res.json(edited);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//* CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { title, description, price, images, category, tags, isIllegal } =
      req.body;

    // Check if a product with the given name already exists
    // Check if required fields are present
    if (!title) {
      return res.status(400).json({ message: "Product title is required" });
    }
    if (!price) {
      return res.status(400).json({ message: "Product price is required" });
    }
    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "category is required" });
    }

    // Check if the category exists
    const categoryExists = await Category.findOne({
      name: category,
    }).exec();
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: `Category ${category} does not exist` });
    }

    // Check if a product with the given name already exists
    const product = await Product.findOne({ title }).exec();
    if (product) {
      return res.status(400).json({
        message: `A Product with the given name: ${title} already exists`,
      });
    }

    // Create new product
    const newProduct = new Product({
      title,
      description,
      tags,
      price,
      images,
      category,
      isIllegal,
    });
    const products = await Product.find();
    newProduct.id = assignID(products);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//* UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { title, description, price, images, category, isIllegal, id, tags } =
      req.body;

    // Check for missing fields
    if (
      !title ||
      !description ||
      !price ||
      !images ||
      !category ||
      id === undefined
    ) {
      // console.log("BODY====> ", req.body);
      return res.status(400).send("All fields are required");
    }

    // Check if the product exists
    const product = await Product.findOne({ id: id });
    if (!product) {
      return res.status(404).send("Product not found with the given ID");
    }

    // Check if the category exists
    const categoryExists = await Category.find({ name: category }).exec();
    if (!categoryExists) {
      return res.status(400).send("Given categoryID does not exist");
    }

    // Update the product

    product.title = title;
    product.description = description;
    product.price = price;
    product.images = images;
    product.category = category;
    product.isIllegal = isIllegal;
    product.tags = tags;

    console.log(product);

    await product.save();
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the product");
  }
};

//* DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Check if the product ID is provided
    if (!id) {
      return res.status(400).send("Product ID is required");
    }

    // Check if the product exists
    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).send("Product not found with the given ID");
    }

    // Delete the product
    await product.deleteOne();
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the product");
  }
};

const modifyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    console.log(payload);
    if (id === undefined) {
      return res.status(400).send("ID is required");
    }

    if (!Object.keys(payload)) {
      return res.status(204).send("No Content given");
    }

    const product = await Product.findOne({ id: id });
    if (!product) {
      return res.status(404).send("Product not found with the given ID");
    }

    for (const key in payload) {
      product[key] = payload[key];
      console.log(product[key]);
    }

    product.save();
    console.log(product);
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the product");
  }
};
const checkout = async (req, res) => {
  try {
    const { user, productIDs } = req.body;
    console.log(productIDs);
    const purchasedProducts = await Product.find({
      id: { $in: [...productIDs] },
    }).exec();
    await sendPurchaseMail(user, purchasedProducts);
    res.status(200).send(purchasedProducts);
  } catch (error) {
    console.log(error);
  }
};

const products = {
  getAllProducts,
  getProductsByFilter,
  createProduct,
  updateProduct,
  deleteProduct,
  modifyProduct,
  checkout,
};

module.exports = {
  products,
};
