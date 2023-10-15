import { Listener, OrderStatus } from '@ticketingpr/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../Models/ordersModel'

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
    const order = await Order.findOne({
      _id: data.id,
      version: data.version,
    })
    if (!order) {
      throw new Error('Ticket not found')
    }
    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    msg.ack()
  }
}
