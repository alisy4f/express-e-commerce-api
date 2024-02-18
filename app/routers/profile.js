import { validateTokenRequest } from "../middlewares/validators.js";
import prisma from "../prisma.js";
import { Router } from "express";
import bycrypt from "bcrypt";
import { config } from "dotenv";

config();

const bcryptRound = Number(process.env.BCRYPT_ROUND);

const router = Router();

router.get("/user", async (req, res) => {
  const user_id = req.user.user_id;

  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });
  res.json({
    user: {
      email: user.email,
      name: user.name,
    },
  });
});

router.put("/user", validateTokenRequest, async (req, res) => {
  const user_id = req.user.user_id;

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res
      .status(400)
      .json({ message: "Missing required fields name, email and password" });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: user_id },
      data: { email, name, password: bycrypt.hashSync(password, bcryptRound), },
    });
    res.json({
      message: "Profil updated successfully",
      user: {
        email: user.email,
        name: user.name,
        password: password,
      },
    });
  } catch (err) {
    res.status(404).json({ message: "Profil update failed" });
  }
});

router.delete("/user", async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await prisma.user.delete({
      where: { id: user_id },
    });
    res.json({
      message: "Profil deleted successfully",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(404).json({ message: "Delete profil failed" });
  }
});

export default router;
