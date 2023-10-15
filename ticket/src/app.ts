import express = require('express')
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {
  errorHandeler,
  NotFoundError,
  currentUserMiddlewareJWS,
} from '@ticketingpr/common'

import { createNewTicketRoute } from './routes/new'
import { showTicketRoute } from './routes/show'
import { createTicketRoute } from './routes/index'
import { updateTicketRouter } from './routes/update'
import { deleteTicketRouter } from './routes/delete'

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

app.use('/', createNewTicketRoute)
app.use('/', showTicketRoute)
app.use('/', createTicketRoute)
app.use('/', updateTicketRouter)
app.use('/', deleteTicketRouter)

app.all('*', async (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorHandeler)

export { app }
