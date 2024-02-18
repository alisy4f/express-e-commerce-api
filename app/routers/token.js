import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";
import prisma from "../prisma.js";
import { validateTokenRequest } from "../middlewares/validators.js";

const router = Router();

router.post("/token", validateTokenRequest, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    include: {
      role: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  if (user.is_blocked) {
    return res.status(401).json({
      message: "User is blocked",
    });
  }

  const validPassword = bcrypt.compareSync(req.body.password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // generate a token that is not already exists in the database
  //   let token;
  //   do {
  //     token = crypto.randomBytes(64).toString("base64");
  //   } while (await prisma.token.findUnique({ where: { token } }));

  //   await prisma.token.create({
  //     data: {
  //       token,
  //       user_id: user.id,
  //       expires_at: new Date(Date.now() + 2592000000), // 30 days
  //     },
  //   });

  const payload = {
    user_id: user.id,
    email: user.email,
    role_id: user.role_id,
    role: user.role.name,
  };

  const expiresIn = 60 * 60 * 24 * 30;

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
  res.json({
    data: {
      user_id: user.id,
      email: user.email,
      role_id: user.role_id,
      role: user.role.name,
    },
    token,
  });
});

export default router;
