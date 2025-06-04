import express from 'express'
import userModel from "../models/userModel.js";

const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  const result = await userModel.insertOne({ name: name, email: email, pass: pass });
  return res.json(result);
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const result = await userModel.findOne({ email, pass });
  if (!result) return res.json({ message: "Invalid user or password" });
  return res.json(result);
});

userRouter.get("/:id/name",async (req, res) => {
    const email = req.params.id;
    const result = await userModel.findOne({email},{_id:0,name:1,email:1});
    return res.json(result);
});
export default userRouter