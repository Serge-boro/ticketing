import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../../mongooseModel/ticketModel'
import { Order, OrderStatus } from '../../../mongooseModel/orderModel'
import { Types } from 'mongoose'

import { natsWrapper } from '../../nats-wrapper'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()

  return ticket
}

it('marks an order as cancelled', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const { body: order } = await request(app)
    .post('/api/order')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  await request(app)
    .delete(`/api/order/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204)

  const updateOrder = await Order.findById(order.id)

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits a order canceled events', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const { body: order } = await request(app)
    .post('/api/order')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  await request(app)
    .delete(`/api/order/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
