import mongoose from 'mongoose'
const orderSchema = mongoose.Schema({
  
  email: { type: String },
  value: { type: Number }

});
export default mongoose.model("Order", orderSchema);