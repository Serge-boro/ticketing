import { Router, Response, Request } from 'express'
import { requireAuth } from '@ticketingpr/common'
import { Order } from '../../mongooseModel/orderModel'

const router = Router()

router.get('/api/order', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket')

  res.status(201).send(order)
})

export { router as showOrderRoute }
