const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { assignID } = require("../utils/helpers");
const request = require("request");
require("dotenv").config();

const SECRET_KEY = "silkyway_is_the_best";
const tokenExpiresIn = 24 * 60 * 60; // hours * minutes * seconds

async function getLocation(ip) {
  return new Promise((resolve, reject) => {
    console.log(`IP: ${ip}`);
    request("http://ip-api.com/json/"+ip, (err, resp) => {
      if (err) {
        console.log(err.message);
        return reject(err);
      } else {
        const ipinfo = JSON.parse(resp.body);
        resolve({ city: ipinfo.city, country: ipinfo.country });
      }
    });
  });
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send("Invalid password");
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: tokenExpiresIn,
    });

    const location = await getLocation(req.ip);

    res.cookie(
      "user",
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isAdmin: user.isAdmin || false,
        cart: user.cart,
        city: location.city, // Add city here
        country: location.country, // Add country here
      },
      { httpOnly: false }
    );
    console.log("TEST===>", location);
    res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true }) // Set token in cookie
      .send({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        token: token,
        cart: user.cart,
        city: location.city, // Add city here
        country: location.country, // Add country here
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname, address, isAdmin } = req.body;
    const user = await User.findOne({ email }).exec();
    if (user) {
      res.status(400).send("The email address is already in use");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstname,
      isAdmin,
      lastname,
      address,
    });

    const users = await User.find();
    newUser.id = assignID(users);
    await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      SECRET_KEY,
      {
        expiresIn: tokenExpiresIn,
      }
    );

    const location = await getLocation(req.ip);

    res.cookie(
      "user",
      {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        isAdmin: user.isAdmin || false,
        cart: newUser.cart,
        city: location.city, // Add city here
        country: location.country, // Add country here
      },
      { httpOnly: false }
    );

    res
      .status(201)
      .cookie("token", token, { httpOnly: true, secure: true }) // Set token in cookie
      .json({
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        token: token,
        email: newUser.email,
        cart: newUser.cart,
        city: location.city, // Add city here
        country: location.country, // Add country here
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const checkToken = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return false;
    }
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    return true;
  } catch (error) {
    console.log("ERROR=>> ", error);
    res.clearCookie("token");
    res.clearCookie("user");
    return false;
  }
};

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token").clearCookie("user").send("Logged out successfully");
};

const auth = {
  login,
  register,
  authenticateJWT,
  logoutUser,
  checkToken,
};

module.exports = {
  auth,
};
