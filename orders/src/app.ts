import express = require('express')
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {
  errorHandeler,
  NotFoundError,
  currentUserMiddlewareJWS,
} from '@ticketingpr/common'

import { createNewOrderRoute } from './routes/new'
import { showOrderRoute } from './routes/show'
import { showOneIdOrderRoute } from './routes/orderOne'
import { deleteOrderRouter } from './routes/delete'

const app = express()

//after cookie-session library ==> avoid issue with proxy nginx
app.set('trust proxy', true)

app.use(express.json())

//cookie-session
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserMiddlewareJWS)

app.use('/', createNewOrderRoute)
app.use('/', showOrderRoute)
app.use('/', showOneIdOrderRoute)
app.use('/', deleteOrderRouter)

app.all('*', async (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorHandeler)

export { app }
