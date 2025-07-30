const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const bcryptjs = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { router: authRoutes, authenticateJWT } = require("./auth");
const cartRoutes = require("./cart");
app.use(authRoutes);
app.use(cartRoutes);

const MONGODB_URI =
 "mongodb+srv://fernandoimasha2003:q5dJBlJSHXPwDEbO@cluster0.4oxlw6a.mongodb.net/"
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connection success"))
  .catch((err) => console.log("connection failed:", err.errmsg));

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "there is internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "the items that you were searching for does not exist",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

app.listen(8080, () => {
  console.log("server is running 8080");
});