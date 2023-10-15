import { Router, Request, Response } from 'express'
import { NotFoundError } from '@ticketingpr/common'
import { Ticket } from '../../mongooseModel/ticketModel'

const router = Router()

router.get('/api/ticket/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const ticket = await Ticket.findById({ _id: id })

  if (!ticket) {
    throw new NotFoundError()
  }

  res.status(200).json({ ticket })
})

export { router as showTicketRoute }
