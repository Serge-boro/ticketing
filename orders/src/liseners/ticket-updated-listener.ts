import { Message } from 'node-nats-streaming'
import { Listener } from '@ticketingpr/common'
import { Ticket } from '../../mongooseModel/ticketModel'
import { queueGroupName } from './ticket-created-listeners'

export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated
  data: {
    id: string
    title: string
    price: number
    userId: string
    version: number
    orderId?: string
  }
}

export class TicketUpdateListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    const ticket = await Ticket.findByEvent(data)
    // console.log({ ticket, data })
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }
}
