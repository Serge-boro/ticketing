import mongoose from 'mongoose'
import { Router, Response, Request } from 'express'
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validationRequest,
} from '@ticketingpr/common'
import { body } from 'express-validator'

import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

//mongoose schemas:
import { Ticket } from '../../mongooseModel/ticketModel'
import { Order } from '../../mongooseModel/orderModel'

const EXPIRATION_WINDOW_SECONDS = 1 * 60000

const router = Router()

const validator = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketID must be provided'),
]

router.post(
  '/api/order',
  //app.use(currentUserMiddlewareJWS) on the app.ts ==> works first and checks currentUser
  requireAuth,
  validator,
  validationRequest,
  async (req: Request, res: Response) => {
    // find the ticket the user is trying to order in database
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    //Make sure that ticket is not already reserved
    //Run query to look at all orders and find an order where orders status is not cancelled ==> ticket is reserved

    // instead below ticket.isReserve() ==> '../../mongooseModel/orderModel' :
    // const existingOrder = await Order.findOne({
    //   ticket: ticket,
    //   status: {
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPaymnet,
    //       OrderStatus.Complete,
    //     ],
    //   },
    // })

    const isReserved = await ticket.isReserve()

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    //Calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //Build the order and save it in DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })

    await order.save()

    //Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    })

    res.status(201).send(order)
  }
)

export { router as createNewOrderRoute }
