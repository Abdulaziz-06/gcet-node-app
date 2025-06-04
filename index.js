import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config();

import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
app.use(cors());
app.use(express.json())


// app.listen(8080, async () => {
//     console.log("Server Started on port 8080");
//     console.log("Connecting to MongoDB...");
//     console.log("MongoDB URI:", MONGODB_URI ? "URI loaded successfully" : "URI not found");
    
//     try {
//         await mongoose.connect(MONGODB_URI);
//         console.log("Connected to MongoDB successfully!");
//     } catch (error) {
//         console.error("MongoDB connection error:", error.message);
//     }
// });

// app.get("/",(req,res)=>{
//   return res.send("Hello Good morning");
// });

// app.get("/greet",(req,res)=>{
//     return res.send("Hello Greetings");
// });

// app.get("/name",(req,res)=>{
//   return res.send("<h1>Hello Abdul </h1>");
// });

// app.get("/d",(req,res)=>{
//   return res.send(" <h2>Todays weather 40 degrees</h2>");
// })


console.log("Connecting to MongoDB...");
console.log("MongoDB URI:", MONGODB_URI ? "URI loaded successfully" : "URI not found");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(8080, () => {
      console.log("Server Started on port 8080");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
app.use("/users", userRouter);

app.use("/products", productRouter);

app.use("/order", orderRouter);

