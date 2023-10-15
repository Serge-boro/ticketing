import { CustomError } from './custom-error'

export class NotFoundError extends CustomError {
  statusCode = 404
  context = 'Not found route'
  constructor() {
    super('Route not found')

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [{ message: this.context }]
  }
}
