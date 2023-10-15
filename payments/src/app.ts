import express = require('express')
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {
  errorHandeler,
  NotFoundError,
  currentUserMiddlewareJWS,
} from '@ticketingpr/common'

import { createNewPaymentRoute } from './routes/new'

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

app.use(createNewPaymentRoute)

app.all('*', async (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorHandeler)

export { app }
