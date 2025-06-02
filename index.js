const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.listen(8080,()=>{
    console.log("Server Started on port 8080");
});

app.get("/",(req,res)=>{
  return res.send("Hello Good morning");
});

app.get("/greet",(req,res)=>{
    return res.send("Hello Greetings");
});

app.get("/name",(req,res)=>{
  return res.send("<h1>Hello </h1>");
});

app.get("/d",(req,res)=>{
  return res.send(" 40 degrees");
})

const products = [
  { id: 1,name:"Product 1",price:100},
  { id: 2,name:"Product 2",price:200},
  { id: 3,name:"Product 3",price:300}
];
app.get("/products",(req,res)=>{
  res.send(products);
})