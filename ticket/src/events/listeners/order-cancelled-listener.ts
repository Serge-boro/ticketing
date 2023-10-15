import { Listener } from '@ticketingpr/common'
import { queueGroupName } from './order-created-listeners'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../mongooseModel/ticketModel'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

enum Subjects {
  OrderCancelled = 'order:cancelled',
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled
  data: {
    id: string
    version: number
    ticket: {
      id: string
    }
  }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.set({ orderId: data.id })
    await ticket.save()

    const { id, price, title, userId, orderId, version } = ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      orderId,
      version,
    })

    msg.ack()
  }
}
