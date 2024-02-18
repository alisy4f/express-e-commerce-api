import { Router } from "express";
import prisma from "../prisma.js";
import { authorizePermission } from "../middlewares/validators.js";
import { Permission } from "../authorization.js";
import axios from "axios";

const router = Router();

router.post(
  "/orders",
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    try {
      const cartData = await prisma.cart.findMany({
        where: { user_id: req.user.user_id },
        include: { product: true },
      });

      if (cartData.length === 0) {
        return res
          .status(400)
          .json({ message: "Cart is empty. Cannot create order." });
      }

      const total = cartData.reduce((acc, item) => acc + item.total, 0);

      const order = await prisma.order.create({
        data: {
          date: new Date(),
          number: `ORD/${Math.floor(Math.random() * 1000)}`,
          user_id: req.user.user_id,
          total,
        },
      });

      const orderItems = cartData.map((item) => {
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          total: item.total,
          price: item.product.price,
        };
      });

      await prisma.orderItem.createMany({ data: orderItems });

      await prisma.cart.deleteMany({
        where: { user_id: req.user.user_id },
      });

      res.json({ message: "Order created successfully", order });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.get(
  "/orders",
  authorizePermission(Permission.BROWSE_ORDERS),
  async (req, res) => {
    const seller = req.user.role_id;
    const buyer = req.user.user_id;

    if (seller === 1) {
      const orders = await prisma.order.findMany({
        orderBy: { date: "desc" },
      });
      res.json(orders);
    }

    const orders = await prisma.order.findMany({
      where: { user_id: Number(buyer) },
      orderBy: { date: "desc" },
    });
    res.json(orders);
  }
);

router.get(
  "/orders/:id",
  authorizePermission(Permission.READ_ORDER),
  async (req, res) => {
    const seller = req.user.role_id;
    const buyer = req.user.user_id;

    const { id } = req.params;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }
    try {
      if (seller === 1) {
        const order = await prisma.order.findUniqueOrThrow({
          where: { id: Number(id) },
          include: {
            order_items: {
              include: { product: true },
            },
          },
        });
        res.json(order);
        return;
      }

      const order = await prisma.order.findUniqueOrThrow({
        where: { id: Number(id), user_id: Number(buyer) },
        include: {
          order_items: {
            include: { product: true },
          },
        },
      });
      res.json(order);
    } catch (err) {
      res.status(404).json({ message: "Order not found" });
    }
  }
);

router.post(
  "/orders/pay",
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    const data = req.body;
    const id = req.user.user_id;

    try {
      if (!data || !id) {
        return res
          .status(400)
          .json({ message: "Missing order or payment data" });
      }

      if (
        !data.orderNumber ||
        !data.cardNumber ||
        !data.cvv ||
        !data.expiryMonth ||
        !data.expiryYear
      ) {
        return res
          .status(400)
          .json({ message: "Missing required fields for payment" });
      }

      if (
        isNaN(
          data.cardNumber || data.cvv || data.expiryMonth || data.expiryYear
        )
      ) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const order = await prisma.order.findFirst({
        where: { number: data.orderNumber, user_id: Number(id) },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status === "paid") {
        return res.status(400).json({ message: "Order already paid" });
      }

      if (order.status === "failed") {
        return res.status(400).json({ message: "Order payment failed" });
      }

      const dataPayment = {
        amount: order.total,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
      };

      const paymentRes = await axios.post(
        "http://localhost:3000/pay",
        dataPayment
      );

      if (paymentRes.status === 200) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "paid" },
        });
      } else {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "failed" },
        });
      }

      res.json({ message: "success", payment: paymentRes.data });
    } catch (error) {
      console.log("Error processing payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
