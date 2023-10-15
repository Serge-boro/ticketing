import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../../mongooseModel/ticketModel'
import mongoose from 'mongoose'

import { natsWrapper } from '../../nats-wrapper'

it('returns 404 if the provide id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .patch(`/api/ticket/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'ddd', price: 20 })
    .expect(404)
})

it('returns 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .patch(`/api/ticket/${id}`)
    .send({ title: 'ddd', price: 20 })
    .expect(401)
})
it('return a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/ticket')
    .set('Cookie', global.signin())
    .send({ title: 'ddd', price: 20 })

  // console.log(response.body)

  await request(app)
    .patch(`/api/ticket/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'ddd!!!', price: 1000 })
    .expect(401)
})
it('returns a 400 if the user provided an invalid title or price', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/ticket')
    .set('Cookie', cookie)
    .send({ title: 'ddd', price: 20 })

  await request(app)
    .patch(`/api/ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 20 })
    .expect(400)

  await request(app)
    .patch(`/api/ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'sss', price: -20 })
    .expect(400)
})
it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/ticket')
    .set('Cookie', cookie)
    .send({ title: 'ddd', price: 20 })

  await request(app)
    .patch(`/api/ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/ticket/${response.body.id}`)
    .send()

  expect(ticketResponse.body.ticket.title).toEqual('new title')
  expect(ticketResponse.body.ticket.price).toEqual(100)
})

it('published an event', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/ticket')
    .set('Cookie', cookie)
    .send({ title: 'ddd', price: 20 })

  await request(app)
    .patch(`/api/ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('reject update if the ticket is reserve', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/ticket')
    .set('Cookie', cookie)
    .send({ title: 'ddd', price: 20 })

  const ticket = await Ticket.findById(response.body.id)
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()

  await request(app)
    .patch(`/api/ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(401)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
