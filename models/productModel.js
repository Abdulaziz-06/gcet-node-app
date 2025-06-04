import mongoose from 'mongoose'
const productSchema = mongoose.Schema({
  name: { type: String },
  price: { type: Number }
});
const Product = mongoose.model("Products", productSchema);
export default Product;