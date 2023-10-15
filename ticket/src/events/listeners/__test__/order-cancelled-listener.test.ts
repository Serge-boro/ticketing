import { Ticket } from '../../../../mongooseModel/ticketModel'
import {
  OrderCancelledListener,
  OrderCancelledEvent,
} from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderStatus } from '@ticketingpr/common'

const setup = async () => {
  //create an instance
  const listener = new OrderCancelledListener(natsWrapper.client)
  //create a fake data events

  const orderId = new Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'sdsds',
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket, orderId }
}

it('update the ticket', async () => {
  const { listener, data, msg, ticket, orderId } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  // expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
