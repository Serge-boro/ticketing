import express = require('express')
import 'express-async-errors'
import {
  currentUserRouter,
  signInRouter,
  signOutRouter,
  signUpRouter,
} from './routes/index'
import cookieSession from 'cookie-session'

// import mongoose from 'mongoose'

import { errorHandeler, NotFoundError } from '@ticketingpr/common'
// import { errorHandeler } from './middlewares/error-handler'
// import { NotFoundError } from './errors/not-found-error'

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

app.use('/api', currentUserRouter, signInRouter, signOutRouter, signUpRouter)

// app.all('*', async (req, res, next) => {
//   next(new NotFoundError())
// })

//express-async-errors library
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandeler)

export { app }
