const { Schema, model, Types } = require("mongoose");

const ProductModel = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },

    price: {
      type: Number,
      // required: true,
    },
    category: {
      type: String,
    },
    isIllegal: {
      type: Boolean,
      // required: true,
    },

    tags: {
      type: Array,
    },
    images: {
      type: Array,
    },
  },
  { collection: "products" }
);
module.exports = model("Product", ProductModel);
