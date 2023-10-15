import { Ticket } from '../../../mongooseModel/ticketModel'
import {
  TicketCretedListener,
  Subjects,
  TicketCreatedEvent,
} from '../ticket-created-listeners'
import { natsWrapper } from '../../nats-wrapper'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  //create an instance
  const listener = new TicketCretedListener(natsWrapper.client)
  //create a fake data events
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new Types.ObjectId().toHexString(),
  }
  //create a fake message

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('create and save a ticket', async () => {
  const { listener, data, msg } = await setup()
  //call the onMessage()
  await listener.onMessage(data, msg)
  //write ==> to make sure ticket was creating

  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  // expect(ticket!.price).toEqual(data.price)
})

it('asks the message', async () => {
  const { listener, data, msg } = await setup()
  //call the onMessage()

  await listener.onMessage(data, msg)

  //write ==> to make sure ticket was calling
  expect(msg.ack).toBeCalled()
})
