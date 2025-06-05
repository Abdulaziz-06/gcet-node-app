import express from 'express'
import userModel from "../models/userModel.js";

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
    const result = await userModel.findOne({ email, password: pass });
    if (!result) return res.json({ message: "Invalid user or password" });
    return res.json(result);
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
export default userRouter