import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../../mongooseModel/ticketModel'
import { Types } from 'mongoose'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new Types.ObjectId().toHexString(),
  })
  await ticket.save()

  return ticket
}

it('fetch the order', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const { body: order } = await request(app)
    .post('/api/order')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const { body: fetchOrder } = await request(app)
    .get(`/api/order/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(201)

  expect(fetchOrder.id).toEqual(order.id)
})

it('return an error if the user tried to fetch another order', async () => {
  const ticketOne = await buildTicket()

  const userOne = global.signin()

  const { body: order } = await request(app)
    .post('/api/order')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  await request(app)
    .get(`/api/order/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})
