import { Router, Request, Response } from 'express'
import { Ticket } from '../../mongooseModel/ticketModel'

const router = Router()

router.get('/api/ticket', async (req: Request, res: Response) => {
  const ticket = await Ticket.find({})
  res.status(200).send(ticket)
})

export { router as createTicketRoute }
