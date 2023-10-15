import { Message } from 'node-nats-streaming'
import { Listener } from '@ticketingpr/common'
import { Ticket } from '../../mongooseModel/ticketModel'

export const queueGroupName = 'order-service'

export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated
  data: {
    id: string
    title: string
    price: number
    userId: string
    version: number
  }
}

export class TicketCretedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    const ticket = Ticket.build({
      id,
      title,
      price,
    })
    await ticket.save()

    msg.ack()
  }
}
