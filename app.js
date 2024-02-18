import express from "express";
import productRoutes from './app/routers/product.js'
import categoryRoutes from './app/routers/category.js'
import orderRoutes from './app/routers/order.js'
import cartRoutes from './app/routers/cart.js'
import tokenRoutes from './app/routers/token.js'
import searchRoutes from './app/routers/search.js'
import userRoutes from './app/routers/user.js'
import profile from './app/routers/profile.js'
import { validateLoginRequest } from "./app/middlewares/validators.js";

const app = express();

app.use(express.json());

app.use(searchRoutes)
app.use(userRoutes)
app.use(tokenRoutes)
app.use(validateLoginRequest)

app.use(profile)
app.use(productRoutes)
app.use(categoryRoutes)
app.use(orderRoutes)
app.use(cartRoutes)

export default app