import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
// import { RequestValidationError } from '../errors/request-validation-error'

import { validationRequest, BadRequestError } from '@ticketingpr/common'
// import { BadRequestError } from '../errors/bad-request-error'
// import { validationRequest } from '../middlewares/validate-request'

import jwt from 'jsonwebtoken'

//Test
// import { DatabaseConnectionError } from '../errors/database-connecting-error'

import { User } from '../mongooseModel/user'

const router = Router()

const validator = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters '),
]

//express-async-errors library in index.js
router.post(
  '/users/signup',
  validator,
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    //#  validationRequest ==> '../middlewares/validate-request'
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array())
    // }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('Email already exist')
    }

    const user = User.build({ email, password })
    await user.save()

    const userJWT = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJWT,
    }

    res.status(201).json(user)
  }
)

export { router as signUpRouter }
