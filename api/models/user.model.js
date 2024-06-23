const { Schema, model, Types } = require("mongoose");

const UserModel = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      type: String,
    },
    credits: {
      type: Number,
      default: 100,
    },
    isAdmin: {
      type: Boolean,
      default: true,
      required: true,
    },
    cart: {
      type: Array,
      default: [],
    },
  },
  { collection: "users" }
);
module.exports = model("User", UserModel);
