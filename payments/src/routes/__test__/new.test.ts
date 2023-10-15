import request from 'supertest'
import { app } from '../../app'
import { Types } from 'mongoose'
import { Order, OrderStatus } from '../../Models/ordersModel'

import { natsWrapper } from '../../nats-wrapper'

it('return 404 when the order does not exist', async () => {
  const orderId = new Types.ObjectId().toHexString()

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId, token: 'dsdsdsd' })

  expect(response.status).toEqual(404)
})

it('return an error if the ticket already reserved', async () => {
  const order = Order.build({
    status: OrderStatus.Created,
    price: 20,
    userId: new Types.ObjectId().toHexString(),
    id: new Types.ObjectId().toHexString(),
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId: order.id, token: 'dsdsdsd' })
    .expect(401)
})

it('return 400 when order cancelled', async () => {
  const userId = new Types.ObjectId().toHexString()

  const order = Order.build({
    status: OrderStatus.Cancelled,
    price: 20,
    userId,
    id: new Types.ObjectId().toHexString(),
    version: 0,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'dsdsdsd' })
    .expect(401)
})
