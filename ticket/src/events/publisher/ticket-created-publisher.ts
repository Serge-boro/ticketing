import { Stan } from 'node-nats-streaming'

enum Subjects {
  TicketCreated = 'ticket:created',
}

interface Event {
  subject: Subjects
  data: any
}

interface TicketCreatedEvent {
  subject: Subjects.TicketCreated
  data: {
    id: string
    version: number
    title: string
    price: number
    userId: string
  }
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

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
