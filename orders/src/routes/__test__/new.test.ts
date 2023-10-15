import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'

import { Ticket } from '../../../mongooseModel/ticketModel'
import { Order, OrderStatus } from '../../../mongooseModel/orderModel'

import { natsWrapper } from '../../nats-wrapper'

it('return an error if the ticket does not exist', async () => {
  const ticketId = new Types.ObjectId().toHexString()

  const response = await request(app)
    .post('/api/order')
    .set('Cookie', global.signin())
    .send({ ticketId })

  expect(response.status).toEqual(404)
})

it('return an error if the ticket already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'sdsdsdsd',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  await request(app)
    .post('/api/order')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(401)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'consert',
    price: 20,
    id: new Types.ObjectId().toHexString(),
  })

  await ticket.save()

  await request(app)
    .post('/api/order')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emit an order created events NATS', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new Types.ObjectId().toHexString(),
  })

  await ticket.save()

  await request(app)
    .post('/api/order')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
