import { Listener, OrderStatus } from '@ticketingpr/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../Models/ordersModel'

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
    const { id, status, userId, version } = data
    const order = Order.build({
      id,
      status,
      price: data.ticket.price,
      userId,
      version,
    })
    await order.save()

    msg.ack()
  }
}
