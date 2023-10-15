import { Listener, OrderStatus } from '@ticketingpr/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../mongooseModel/ticketModel'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

export const queueGroupName = 'ticket-service'

export enum Subjects {
  OrderCreated = 'order:created',
}

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated
  data: {
    id: string
    version: number
    status: OrderStatus
    userId: string
    expiresAt: string
    ticket: {
      id: string
      price: number
    }
  }
}

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
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
