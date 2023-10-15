import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})

it('return a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'dddddddddd', password: 'password' })
    .expect(400)
})

it('return a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'p' })
    .expect(400)
})

it('return a 400 with missing email and password', async () => {
  await request(app).post('/api/users/signup').send({ email: '' }).expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({ password: '' })
    .expect(400)
})

it('disallows dublicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'asdfgh' })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'asdfgh' })
    .expect(401)
})

//main app.ts ==> cookieSession ==> secure: process.env.NODE_ENV !== 'test'
it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'asdfgh' })
    .expect(201)

  expect(response.get('Set-cookie')).toBeDefined()
})
