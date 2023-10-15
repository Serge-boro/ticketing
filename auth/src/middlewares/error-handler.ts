import { Request, Response, NextFunction } from 'express'
// import { RequestValidationError } from '../errors/request-validation-error'
// import { DatabaseConnectionError } from '../errors/database-connecting-error'
import { CustomError } from '../errors/custom-error'

export const errorHandeler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (err instanceof RequestValidationError) {
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  // }

  // if (err instanceof DatabaseConnectionError) {
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  // }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }

  res.status(400).send({ errors: [{ message: 'Generic error' }] })
}
