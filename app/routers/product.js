import prisma from "../prisma.js";
import { Router } from "express";
import { authorizePermission } from "../middlewares/validators.js";
import { Permission } from "../authorization.js";

const router = Router();

router.post(
  "/products",
  authorizePermission(Permission.ADD_PRODUCT),
  async (req, res) => {
    const { name, category_id, price, in_stock, description } = req.body;

    if (!name || !category_id || !price || !in_stock) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const product = await prisma.product.create({
      data: { name, category_id, price, in_stock, description },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({ message: "Product created successfully", product });
  }
);

router.put(
  "/products/:id",
  authorizePermission(Permission.EDIT_PRODUCT),
  async (req, res) => {
    const { name, category_id, price, in_stock, description } = req.body;

    if (!name || !category_id || !price) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await prisma.product.update({
        where: { id: Number(productId) },
        data: { name, category_id, price, in_stock, description },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      res.json({ message: "Product updated successfully", product });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.delete(
  "/products/:id",
  authorizePermission(Permission.DELETE_PRODUCT),
  async (req, res) => {
    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await prisma.product.delete({
        where: { id: Number(productId) },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      res.json({ message: "Product deleted successfully", product });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

export default router;
