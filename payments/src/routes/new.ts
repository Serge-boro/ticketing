import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validationRequest,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
} from '@ticketingpr/common'
import { Order } from '../Models/ordersModel'

// import { natsWrapper } from '../nats-wrapper'

const router = Router()

const validator = [
  body('token').not().isEmpty().withMessage('token is not valid'),
  body('orderId').not().isEmpty().withMessage('orderId is not valid'),
]

router.post(
  '/api/payments',
  requireAuth,
  validator,
  validationRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order || order === null) {
      throw new NotFoundError()
    }

    if (order.id !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order')
    }

    // await ticket.save()

    // //../events/publisher/ticket-created-publisher
    // await new TicketCreatedPublisher(natsWrapper.client).publish({
    //   id: ticket.id,
    //   version: ticket.version,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // })

    res.status(201).send({ success: true })
  }
)

export { router as createNewPaymentRoute }
