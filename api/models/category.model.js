const { Schema, model, Types } = require("mongoose");

const CategoryModel = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { collection: "categories" }
);
module.exports = model("Category", CategoryModel);
