import express from 'express'
import cartModel from "../models/cartModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const cartRouter = express.Router()

// Get user's cart
cartRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cart = await cartModel.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new cartModel({
        userId,
        email: '', // Will be updated when items are added
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }
    
    return res.status(200).json({
      message: "Cart retrieved successfully",
      cart: cart
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add item to cart
cartRouter.post("/add", async (req, res) => {
  try {
    const { userId, email, productId, productName, price, quantity = 1 } = req.body;
    
    if (!userId || !productId || !productName || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    let cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      // Create new cart
      cart = new cartModel({
        userId,
        email,
        items: [{
          productId,
          productName,
          price,
          quantity
        }],
        totalAmount: price * quantity
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          productId,
          productName,
          price,
          quantity
        });
      }
      
      // Recalculate total
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      cart.updatedAt = new Date();
    }
    
    await cart.save();
    
    return res.status(200).json({
      message: "Item added to cart successfully",
      cart: cart
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Remove item from cart or decrease quantity
cartRouter.post("/remove", async (req, res) => {
  try {
    const { userId, productId, removeCompletely = false } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }
    
    const cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    if (removeCompletely || cart.items[itemIndex].quantity <= 1) {
      // Remove item completely
      cart.items.splice(itemIndex, 1);
    } else {
      // Decrease quantity
      cart.items[itemIndex].quantity -= 1;
    }
    
    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    cart.updatedAt = new Date();
    await cart.save();
    
    return res.status(200).json({
      message: "Item updated in cart successfully",
      cart: cart
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Clear entire cart
cartRouter.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await cartModel.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = new Date();
    
    await cart.save();
    
    return res.status(200).json({
      message: "Cart cleared successfully",
      cart: cart
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Checkout - Process cart and create order
cartRouter.post("/checkout", async (req, res) => {
  try {
    const { userId, email, items, subtotal, deliveryFee, total } = req.body;
    
    if (!userId || !email || !items || !subtotal || !total) {
      return res.status(400).json({ message: "Missing required checkout information" });
    }
    
    // Verify user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create order
    const newOrder = new orderModel({
      userId,
      email,
      items: items.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      deliveryFee: deliveryFee || 40,
      total,
      value: total // For backward compatibility
    });
    
    const savedOrder = await newOrder.save();
    
    // Clear user's cart after successful order
    await cartModel.findOneAndUpdate(
      { userId },
      { 
        items: [], 
        totalAmount: 0, 
        updatedAt: new Date() 
      }
    );
    
    return res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default cartRouter