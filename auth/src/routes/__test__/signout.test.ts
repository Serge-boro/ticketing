import request from 'supertest'
import { app } from '../../app'

it('clear the cookie after signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(201)

  // console.log(response.get('Set-cookie'))
  expect(response.get('Set-cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  )
})
