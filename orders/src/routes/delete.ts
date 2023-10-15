import { Router, Response, Request } from 'express'
import { Order, OrderStatus } from '../../mongooseModel/orderModel'
import { Ticket } from '../../mongooseModel/ticketModel'
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@ticketingpr/common'

import { natsWrapper } from '../nats-wrapper'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'

//OrderStatus ==> '../../mongooseModel/orderModel' ==> '@ticketingpr/common'

const router = Router()

//PATCH ==> we are going to change status order
router.delete('/api/order/:id', async (req: Request, res: Response) => {
  const { id: orderId } = req.params

  const ticket = await Ticket.findById(orderId)

  const order = await Order.findById(orderId).populate('ticket')
  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled

  await order.save()

  //Publish an event saying that an order was created
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  })

  res.status(204).send(order)
})

export { router as deleteOrderRouter }
