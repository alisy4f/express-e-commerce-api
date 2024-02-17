import { Router } from 'express'
import prisma from '../prisma.js'
import { authorizePermission } from '../middlewares/validators.js'
import { Permission } from '../authorization.js'

const router = Router()

router.post('/orders', authorizePermission(Permission.ADD_ORDER), async (req, res) => {
  try {
    const cartData = await prisma.cart.findMany({
      where: { user_id: req.user.user_id },
      include: { product: true }
    })

    if (cartData.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot create order.' });
    }

    const total = cartData.reduce((acc, item) => acc + item.total, 0)

    const order = await prisma.order.create({
      data: {
        date: new Date(),
        number: `ORD/${Math.floor(Math.random() * 1000)}`,
        user_id: req.user.user_id,
        total
      }
    })

    const orderItems = cartData.map((item) => {
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        total: item.total,
        price: item.product.price
      }
    })

    await prisma.orderItem.createMany({ data: orderItems })

    await prisma.cart.deleteMany({
      where: { user_id: req.user.user_id }
    })

    res.json({ message: 'Order created successfully', order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/orders', authorizePermission(Permission.BROWSE_ORDERS), async (req, res) => {
  
  const seller = req.user.role_id
  const buyer = req.user.user_id

  if (seller === 1) {
    const orders = await prisma.order.findMany({
      orderBy: { date: 'desc' }
    })
    res.json(orders)
  }
  
  const orders = await prisma.order.findMany({
    where: { user_id: Number(buyer) },
    orderBy: { date: 'desc' }
  })
  res.json(orders)
})

router.get('/orders/:id', authorizePermission(Permission.READ_ORDER), async (req, res) => {
  
  const seller = req.user.role_id
  const buyer = req.user.user_id
  
  const { id } = req.params
  try {

    if (seller === 1) {
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: Number(id) },
        include: {
          order_items: {
            include: { product: true }
          }
        }
      })
      res.json(order)
      return
    }

    const order = await prisma.order.findUniqueOrThrow({
      where: { id: Number(id), user_id: Number(buyer) },
      include: {
        order_items: {
          include: { product: true }
        }
      }
    })
    res.json(order)
  } catch (err) {
    res.status(404).json({ message: 'Order not found' })
  }
})

export default router