import { Ticket } from '../../../../mongooseModel/ticketModel'
import {
  OrderCreatedListener,
  Subjects,
  OrderCreatedEvent,
} from '../order-created-listeners'
import { natsWrapper } from '../../../nats-wrapper'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderStatus } from '@ticketingpr/common'

const setup = async () => {
  //create an instance
  const listener = new OrderCreatedListener(natsWrapper.client)
  //create a fake data events

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'sdsds',
  })
  await ticket.save()

  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: 'sfsdf',
    userId: 'sfsf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('sets the userId of the tickets', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('asks the message', async () => {
  const { listener, data, msg } = await setup()
  //call the onMessage()

  await listener.onMessage(data, msg)

  //write ==> to make sure ticket was calling
  expect(msg.ack).toBeCalled()
})

it('publisher ticket update event', async () => {
  const { listener, data, msg } = await setup()
  //call the onMessage()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
