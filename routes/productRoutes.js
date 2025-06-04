import express from 'express';
import Product from '../models/productModel.js';
const productRouter = express.Router()

productRouter.get("/all", async (req, res) => {
  const products = await Product.find();
  return res.json(products);
});


export default productRouter