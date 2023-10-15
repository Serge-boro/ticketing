import { Router, Response, Request } from 'express'
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@ticketingpr/common'
import { Order } from '../../mongooseModel/orderModel'

const router = Router()

router.get(
  '/api/order/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id: orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    res.status(201).send(order)
  }
)

export { router as showOneIdOrderRoute }
