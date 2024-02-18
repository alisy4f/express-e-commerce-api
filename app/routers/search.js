import { authorizePermission } from "../middlewares/validators.js";
import prisma from "../prisma.js";
// import { Permission } from "../authorization.js";
import { Router } from "express";

const router = Router();

router.get(
  "/products",
  async (req, res) => {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(products);
  }
);

router.get(
  "/products/:id",
  async (req, res) => {
    const productId = req.params.id;

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!product) {
        res.status(404).json({ message: "Product not found!" });
        return;
      }
      res.json(product);
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.get(
  "/categories",
  async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
  }
);

router.get(
  "/categories/:id",
  async (req, res) => {
    const categoryId = req.params.id;

    if (isNaN(categoryId)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    try {
      const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
      });
      res.json(category);
    } catch (err) {
      res.status(404).json({ message: "Not found" });
    }
  }
);

router.get(
  "/search",
  async (req, res) => {
    try {
      const query = req.query.q; 
      const page = req.query.page ? parseInt(req.query.page) : 1; 

      const itemsPerPage = 5; 
      const skip = (page - 1) * itemsPerPage; 

     
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } }, 
            { description: { contains: query } },   
            { category: { name: { contains: query } } },  
          ],
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { name: "asc" },   
        skip,   
        take: itemsPerPage,   
      });

      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
