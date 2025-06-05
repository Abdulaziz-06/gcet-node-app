import express from 'express';
import productModel from "../models/productModel.js";

const productRouter = express.Router()

// GET all products
productRouter.get("/all", async (req, res) => {
  try {
    const products = await productModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new product
productRouter.post("/create", async (req, res) => {
  try {
    const { name, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    
    const newProduct = await productModel.create({ name, price });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
productRouter.put("/:id", async (req, res) => {
  try {
    const { name, price } = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
productRouter.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to seed sample data (for testing)
productRouter.post("/seed", async (req, res) => {
  try {
    // Clear existing products
    await productModel.deleteMany({});
    
    // Add sample products
    const sampleProducts = [
      { name: "Laptop", price: 999.99 },
      { name: "Phone", price: 599.99 },
      { name: "Tablet", price: 299.99 },
      { name: "Headphones", price: 149.99 },
      { name: "Mouse", price: 29.99 }
    ];
    
    const createdProducts = await productModel.insertMany(sampleProducts);
    res.json({ 
      message: "Sample products created successfully", 
      count: createdProducts.length,
      products: createdProducts 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default productRouter