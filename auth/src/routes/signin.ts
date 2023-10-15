import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
// import { RequestValidationError } from '../errors/request-validation-error'
import { User } from '../mongooseModel/user'
import jwt from 'jsonwebtoken'

import { validationRequest, BadRequestError } from '@ticketingpr/common'
// import { validationRequest } from '../middlewares/validate-request'
// import { BadRequestError } from '../errors/bad-request-error'

const router = Router()

const validationBody = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password'),
]

router.post(
  '/users/signin',
  validationBody,
  validationRequest,
  async (req: Request, res: Response) => {
    //#  validationRequest ==> '../middlewares/validate-request'
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array())
    // }

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Invalid email credential')
    }

    const checkPassword = await existingUser.comparePassword(password)

    if (!checkPassword) {
      throw new BadRequestError('Invalid password credential')
    }

    const userJWT = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJWT,
    }

    res.status(200).json(existingUser)
  }
)

export { router as signInRouter }
