import { Ticket } from '../../../mongooseModel/ticketModel'
import { Order } from '../../../mongooseModel/orderModel'
import { OrderStatus } from '@ticketingpr/common'
import {
  ExpirationCompleteListener,
  ExpirationCompleteEvent,
} from '../expiration.complete-listener'
import { natsWrapper } from '../../nats-wrapper'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  //create an instance
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  })

  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: 'fffff',
    ticket,
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket, order }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  // const eventData = JSON.parse(
  //   (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  // )
  // expect(eventData.id).toEqual(order.id)
})

// it('ack the message', async () => {
//   const { listener, data, msg } = await setup()

//   await listener.onMessage(data, msg)

//   expect(msg.ack).toHaveBeenCalled()
// })
