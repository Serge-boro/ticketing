import { Stan } from 'node-nats-streaming'
import { OrderStatus } from '@ticketingpr/common'

enum Subjects {
  OrderCreated = 'order:created',
}

interface Event {
  subject: Subjects
  data: any
}

abstract class Publisher<T extends Event> {
  abstract subject: T['subject']
  protected client: Stan

  constructor(client: Stan) {
    this.client = client
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err)
        }
        console.log('Event published to subject', this.subject)
        resolve()
      })
    })
  }
}

interface OrderCreatedEvent {
  subject: Subjects.OrderCreated
  data: {
    id: string
    version: number
    status: OrderStatus
    userId: string
    expiresAt: string
    ticket: {
      id: string
      price: number
    }
  }
}

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated
}
