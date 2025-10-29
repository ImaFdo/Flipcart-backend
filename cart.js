const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      default: 'active'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  })
);

router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;

    if (!productId || !user) {
      return res
        .status(400)
        .json({ message: "productId and user is required" });
    }

    let cart = await Cart.findOne({ userId: user, status: "active" });

    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }
    cart.updatedAt = new Date();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});

    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (error) {
    console.log("error fetching cart", error);
    res.status(500).json({
      success: false,
      message: "failed to fetch data",
      error: error.message,
    });
  }
});

router.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ 
      userId: req.params.userId, 
      status: "active" 
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
});

router.delete("/cart/item", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required"
      });
    }

    const cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message
    });
  }
});

router.delete("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ 
      userId: req.params.userId, 
      status: "active" 
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message
    });
  }
});

router.put("/cart/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, and quantity are required"
      });
    }

    const cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    cart.items[itemIndex].quantity = parseInt(quantity);
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message
    });
  }
});

module.exports = router;