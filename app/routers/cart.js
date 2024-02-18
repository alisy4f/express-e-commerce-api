import { Router } from "express";
import {
  validateAddToCart,
  authorizePermission,
} from "../middlewares/validators.js";
import prisma from "../prisma.js";
import { Permission } from "../authorization.js";

const router = Router();

router.get(
  "/cart",
  authorizePermission(Permission.BROWSE_CART),
  async (req, res) => {
    const user_id = req.user.user_id;

    const cart = await prisma.cart.findMany({
      where: { user_id },
    });
    const total = cart.reduce((acc, item) => acc + item.total, 0);
    res.json({
      cart,
      total,
    });
  }
);

router.post(
  "/cart",
  authorizePermission(Permission.ADD_CART),
  validateAddToCart,
  async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.user_id;

    const product = await prisma.product.findUnique({
      where: { id: Number(product_id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingCart = await prisma.cart.findFirst({
      where: { product_id: Number(product_id), user_id },
    });

    let total = product.price * quantity;

    if (existingCart) {
      const newQuantity = existingCart.quantity + quantity;
      total = product.price * newQuantity;
      await prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: newQuantity, total },
      });

      return res.json({ message: "Cart updated successfully" });
    }

    const cart = await prisma.cart.create({
      data: { product_id, quantity, total, user_id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({ message: "Cart created successfully", cart });
  }
);

router.delete(
  "/cart/:id",
  authorizePermission(Permission.DELETE_CART),
  async (req, res) => {
    const user_id = req.user.user_id;
    const { id } = req.params;

    try {
      await prisma.cart.delete({
        where: { id: Number(id), user_id },
      });
      res.json({ message: "Cart deleted successfully" });
    } catch (err) {
      res.status(404).json({ message: "Cart item not found" });
    }
  }
);

router.delete(
  "/cart",
  authorizePermission(Permission.DELETE_CART),
  async (req, res) => {
    await prisma.cart.deleteMany({
      where: { user_id: req.user.user_id },
    });
    res.json({ message: "Cart emptied successfully" });
  }
);

export default router;
