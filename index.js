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

const MONGO_URL =
  "mongodb+srv://fsuser:<db_password>@cluster0.d4rf1lg.mongodb.net/";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connection success"))
  .catch((err) => console.log("Connection failed:, err.errmsg"));

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
    const products = await Product.findById(rez.params.id);
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
  console.log("server is running 8080");
});
