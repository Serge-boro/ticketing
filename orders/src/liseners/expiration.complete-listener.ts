import { Listener, OrderStatus } from '@ticketingpr/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../mongooseModel/orderModel'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'

export const queueGroupName = 'expiration-service'

enum Subjects {
  ExpirationComplete = 'expiration:complete',
}

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete
  data: {
    orderId: string
  }
}

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })
  }
}
