import { Permission } from "../authorization.js";
import { authorizePermission } from "../middlewares/validators.js";
import prisma from "../prisma.js";
import { Router } from "express";

const router = Router();

router.post(
  "/categories",
  authorizePermission(Permission.ADD_CATEGORY),
  async (req, res) => {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.json({ message: "Category created successfully", category });
  }
);

router.put(
  "/categories/:id",
  authorizePermission(Permission.EDIT_CATEGORY),
  async (req, res) => {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const categoryId = req.params.id;

    if (isNaN(categoryId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const category = await prisma.category.update({
        where: { id: Number(categoryId) }, // !!!!!!!!!
        data: { name, category, price, in_stock, description },
      });
      res.json({ message: "Category updated successfully", category });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.delete(
  "/categories/:id",
  authorizePermission(Permission.DELETE_CATEGORY),
  async (req, res) => {
    const categoryId = req.params.id;

    if (isNaN(categoryId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const category = await prisma.category.delete({
        where: { id: Number(categoryId) },
      });
      res.json({ message: "Category deleted successfully", category });
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

export default router;
