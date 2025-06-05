import express from 'express';
import productModel from "../models/productModel.js";

const productRouter = express.Router()

productRouter.get("/all", async (req, res) => {
  try {
    const products = await productModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


productRouter.post("/add-test-data", async (req, res) => {
  try {
    const testProduct = await productModel.create({ 
      name: "Test Product", 
      price: 100 
    });
    res.json({ message: "Test product added", product: testProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default productRouter