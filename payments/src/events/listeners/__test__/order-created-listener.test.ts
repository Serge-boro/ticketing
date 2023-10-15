import { Order } from '../../../Models/ordersModel'
import { natsWrapper } from '../../../nats-wrapper'
import {
  OrderCreatedListener,
  OrderCreatedEvent,
} from '../order-created-listener'

import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderStatus } from '@ticketingpr/common'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: 'sfsdf',
    userId: 'sfsf',
    ticket: {
      id: 'ssdsd',
      price: 10,
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
