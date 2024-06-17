const Category = require("../models/category.model");
const { assignID } = require("../utils/helpers");

//* GET ALL CATEGORIES
const getCategories = async (req, res) => {
  const data = await Category.find().select("-_id -__v");
  res.json(data);
};

//*CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const categories = await Category.find();
    const categoryExists = categories.find((cat) => cat.name === name);
    if (categoryExists) {
      res.status(400).send(`A Category with the name: ${name} already exists`);
      return;
    }

    const newCategory = new Category({
      name,

      id: assignID(categories),
    });
    await newCategory.save();
    res.status(201).send({ id: newCategory.id, name: newCategory.name });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = { getCategories, createCategory };
