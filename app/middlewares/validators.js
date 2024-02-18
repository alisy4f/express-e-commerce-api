import { config } from "dotenv";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

config();

export const validateAddToCart = (req, res, next) => {
  const { product_id, quantity } = req.body;
  if (!product_id) {
    return res.status(422).json({ error: "Product ID is required" });
  }

  if (!quantity) {
    return res.status(422).json({ error: "Quantity is required" });
  }

  next();
};

export const validateTokenRequest = (req, res, next) => {
  const errors = {};

  if (!req.body.email) {
    errors.email = "Email is required";
  }

  // validate valid email
  if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
    errors.email = "Must be a valid email";
  }

  if (!req.body.password) {
    errors.password = "Password is required";
  }

  // validate minimum length
  if (req.body.password?.length < 8) {
    errors.password = "Must be at least 8 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json(errors);
  }

  next();
};

export const validateLoginRequest = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  try {
    const jwtDecode = jwt.verify(token, secret);
    const user = await prisma.user.findUnique({
      where: {
        email: jwtDecode.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    req.user = jwtDecode;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract JWT token from Authorization header

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
      const { role_id } = decodedToken;

      const permissionRecords = await prisma.permissionRole.findMany({
        where: { role_id },
        include: { permission: true },
      });

      const permissions = permissionRecords.map(
        (record) => record.permission.name
      );

      console.log("looking for permission", permission);
      console.log("in permissions", permissions);

      if (!permissions.includes(permission)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      req.user = decodedToken; // Attach decoded user information to the request object
      next();
    } catch (error) {
      console.error("Error verifying JWT token:", error);
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  };
};
