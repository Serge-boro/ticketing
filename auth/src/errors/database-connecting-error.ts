// import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

//export class DatabaseConnectionError extends Error {
export class DatabaseConnectionError extends CustomError {
  statusCode = 503
  reason = 'Error connecting to database'
  constructor() {
    super('Error connecting to DB')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.reason }]
  }
}
