import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'


it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app).get(`/api/ticket/${id}`).send()

  // console.log(response.body)
  expect(response.status).toEqual(404)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert!!'
  const price = 20

  const response = await request(app)
    .post('/api/ticket')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })

  expect(response.status).toEqual(201)

  const ticketResponse = await request(app)
    .get(`/api/ticket/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.ticket.title).toEqual('concert!!')
  expect(ticketResponse.body.ticket.price).toEqual(20)
})
