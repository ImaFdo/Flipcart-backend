const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    useId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
  })
);

router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;

    if (!productId || user) {
      return res
        .status(400)
        .json({ message: "productId and user is required" });
    }

    let cart = await Cart.findOne({ userId: user, status: "active" });

    if (!cart) {
      cart = new Cart({ userId: user, item: [], status: "active" });
    }
    const existingItemIndex = items.findIndex(
      (items) => productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    cart.updateAt = new Date();
    await cart.save();
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});

    res.status(200).json({
      success: true,
      count: cart.length,
      data: carts,
    });
  } catch (error) {
    console.log("error fetching cart", error);
    re.status(500).json({
      success: false,
      massege: "failed too fetch data",
      error: error,
      message,
    });
  }
});

//Delete route

router.delete("/cart/:id", async (req, res) => {
  try {
    // Extract the cart ID from the request parameters
    const cartId = req.params.id;

    // Find the cart by its ID and delete it
    const deletedCart = await Cart.findByIdAndDelete(cartId);

    // Check if a cart was found and deleted
    if (!deletedCart) {
      // If no cart was found with the given ID, return a 404 Not Found error
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    // If the cart was successfully deleted, return a success response
    res.status(200).json({
      success: true,
      message: "Cart deleted successfully.",
      data: deletedCart, // Optionally return the deleted cart data
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error deleting cart:", error);

    // Return a 500 Internal Server Error response for any unexpected errors
    res.status(500).json({
      success: false,
      message: "Failed to delete cart due to an internal server error.",
      error: error.message, // Provide the error message for more details
    });
  }
});

module.exports = router;
