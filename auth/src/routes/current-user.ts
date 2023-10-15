import { Router } from 'express'
import { currentUserMiddlewareJWS, requireAuth } from '@ticketingpr/common'
// import jwt from 'jsonwebtoken'
// import { BadRequestError } from '../errors/bad-request-error'

const router = Router()

router.get('/users/currentuser', currentUserMiddlewareJWS, (req, res) => {
  //../middlewares/current-user-middleware-jws ==> :
  // if (!req.session?.jwt) {
  //   return res.send({ currentUser: null })
  // }
  // try {
  //   const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
  //   res.status(201).json({ currentUser: payload })
  // } catch (err) {
  //   res.send({ currentUser: null })
  // }

  // if (!req.currentUser) {
  //   res.status(200).json({ currentUser: null })
  // } else {
  res.status(200).json({ currentUser: req.currentUser || null })
  // }
})

export { router as currentUserRouter }
