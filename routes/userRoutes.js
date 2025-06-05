import express from 'express'
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    const result = await userModel.create({ name: name, email: email, password: pass });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    
    // Validate input
    if (!email || !pass) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Find user with case-insensitive email
    const result = await userModel.findOne({ 
      email: email.toLowerCase(), 
      password: pass 
    });
    
    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Return user data (excluding password for security)
    const userData = {
      _id: result._id,
      name: result.name,
      email: result.email,
      createdAt: result.createdAt
    };
    
    return res.status(200).json({ 
      message: "Login successful",
      user: userData
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

userRouter.get("/:id/name", async (req, res) => {
  try {
    const email = req.params.id;
    const result = await userModel.findOne({email}, {_id: 0, name: 1, email: 1});
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    
    // Validate input
    if (!email || !pass) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Validate password length
    if (pass.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    // Create new user - extract name from email if not provided
    const userName = name || email.split('@')[0];
    
    const newUser = new userModel({ 
      name: userName, 
      email: email.toLowerCase(), 
      password: pass 
    });
    
    const result = await newUser.save();
    
    // Return user data (excluding password for security)
    const userData = {
      _id: result._id,
      name: result.name,
      email: result.email,
      createdAt: result.createdAt
    };
    
    return res.status(201).json({ 
      message: "Account created successfully", 
      user: userData 
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    return res.status(500).json({ error: error.message });
  }
});

// Cart checkout route (for frontend compatibility)
userRouter.post("/cart", async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total } = req.body;
    
    if (!items || !subtotal || !total) {
      return res.status(400).json({ message: "Missing required checkout information" });
    }
    
    // For now, create order without user authentication
    // In production, you'd want to get userId from authentication token
    const newOrder = new orderModel({
      userId: null, // Will be null for guest orders
      email: "guest@example.com", // Default for guest orders
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
    
    return res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get orders for a specific user
userRouter.get("/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find orders for the specific user
    const orders = await orderModel.find({ userId: userId })
      .sort({ createdAt: -1 }) // Most recent orders first
      .exec();
    
    res.json({
      success: true,
      orders: orders
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

export default userRouter