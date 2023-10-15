import { Router, Request, Response } from 'express'
import { Ticket } from '../../mongooseModel/ticketModel'
import { body } from 'express-validator'
import {
  requireAuth,
  validationRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@ticketingpr/common'

import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

const validator = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
]

router.patch(
  '/api/ticket/:id',
  requireAuth,
  validator,
  validationRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params

    const ticketId = await Ticket.findById({ _id: id })
    if (!ticketId) {
      throw new NotFoundError()
    }

    if (ticketId.orderId) {
      throw new BadRequestError('Cannot edit a reserve ticket')
    }
    if (ticketId.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    // console.log({ user: ticketId.userId, current: req.currentUser!.id })

    const ticket = await Ticket.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    })

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket!.id,
      title: ticket!.title,
      price: ticket!.price,
      userId: ticket!.userId,
      version: ticket!.version,
    })

    res.status(201).json({ ticket })
  }
)

export { router as updateTicketRouter }
