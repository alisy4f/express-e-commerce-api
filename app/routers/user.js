import { validateTokenRequest } from "../middlewares/validators.js";
import prisma from "../prisma.js";
import { Router } from "express";
import bycrypt from "bcrypt";
import { config } from "dotenv";

config();

const router = Router();

const bcryptRound = Number(process.env.BCRYPT_ROUND);

router.post("/register", validateTokenRequest, async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await prisma.user.create({
    data: { email, name, password: bycrypt.hashSync(password, bcryptRound), role_id: 2, is_blocked: false },
  });

  res.json({ 
    message: "User registered successfully", 
    user: {
      email: user.email,
      name: user.name,
    },
   });
});


export default router;
