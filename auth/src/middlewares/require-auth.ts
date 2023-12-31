import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../errors/bad-request-error'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new BadRequestError('Not Authorized')
  }

  next()
}
