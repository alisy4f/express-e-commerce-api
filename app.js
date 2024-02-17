import express from "express";
import productRoutes from './app/routers/product.js'
import categoryRoutes from './app/routers/category.js'
import orderRoutes from './app/routers/order.js'
import cartRoutes from './app/routers/cart.js'
import tokenRoutes from './app/routers/token.js'
import searchRoutes from './app/routers/search.js'
import { validateLoginRequest } from "./app/middlewares/validators.js";

const app = express();

app.use(express.json());

app.use(tokenRoutes)
app.use(validateLoginRequest)

app.use(productRoutes)
app.use(searchRoutes)
app.use(categoryRoutes)
app.use(orderRoutes)
app.use(cartRoutes)

export default app