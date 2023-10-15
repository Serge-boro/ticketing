import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validationRequest } from '@ticketingpr/common'
import { Ticket } from '../../mongooseModel/ticketModel'
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

const validator = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
]

router.post(
  '/api/ticket',
  requireAuth,
  validator,
  validationRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    })

    await ticket.save()

    //../events/publisher/ticket-created-publisher
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(201).send(ticket)
  }
)

export { router as createNewTicketRoute }
