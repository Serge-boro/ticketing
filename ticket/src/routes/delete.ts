import { Router, Request, Response } from 'express'
import { Ticket } from '../../mongooseModel/ticketModel'
import { NotFoundError } from '@ticketingpr/common'

const router = Router()

router.delete('/api/ticket/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const ticket = await Ticket.findByIdAndDelete({ _id: id })

  if (!ticket) {
    throw new NotFoundError()
  }

  res
    .status(201)
    .json({ msg: `deleted product with name ${ticket.title} with id: ${id}` })
})

export { router as deleteTicketRouter }
