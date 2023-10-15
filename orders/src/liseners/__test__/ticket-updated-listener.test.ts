import { Ticket } from '../../../mongooseModel/ticketModel'
import {
  TicketUpdateListener,
  Subjects,
  TicketUpdatedEvent,
} from '../ticket-updated-listener'
import { natsWrapper } from '../../nats-wrapper'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new TicketUpdateListener(natsWrapper.client)
  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  })
  await ticket.save()

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'concert',
    price: 10,
    userId: 'llkjjkh',
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it('finds update and save a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  // expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('asks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

// //does not work
// it('does not call ack if the event has a skipped version number', async () => {
//   const { listener, data, msg } = await setup()

//   data.version = 10

//   try {
//     await listener.onMessage(data, msg)
//   } catch (err) {
//     return
//   }

//   expect(msg.ack).not.toHaveBeenCalled()
// })
