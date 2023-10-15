import { Listener, OrderStatus } from '@ticketingpr/common'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../queues/expiration-queues'

export const queueGroupName = 'expiration-service'

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
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log('delay many miliseconds to process job', delay)
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    )

    msg.ack()
  }
}
