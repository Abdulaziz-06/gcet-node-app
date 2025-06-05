import express from 'express';
import orderModel from '../models/orderModel.js';

const orderRouter = express.Router();

console.log("Order router created successfully");

// Simple test route
orderRouter.get("/test", (req, res) => {
    console.log("Order test route hit!");
    res.json({message: "Order router is working!"});
});

// Get orders by email (your existing route)
orderRouter.get("/:id", async (req, res) => {
    const email = req.params.id;
    const result = await orderModel.find({email}, {});
    return res.json(result);
});

// NEW: Get orders for a specific user by userId
orderRouter.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('Fetching orders for user:', userId);
        
        // Find orders for the specific user
        const orders = await orderModel.find({ userId: userId })
            .sort({ createdAt: -1 }) // Most recent orders first
            .exec();
        
        console.log('Found orders:', orders.length);
        
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

// Create new order (your existing route)
orderRouter.post("/new", async (req, res) => {
    console.log("POST /new route hit!");
    try {
        const {email, value} = req.body;
        console.log("Request body:", {email, value});
        const result = await orderModel.create({email: email, value: value});
        return res.json(result);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({error: 'Failed to create order'});
    }
});

export default orderRouter;
