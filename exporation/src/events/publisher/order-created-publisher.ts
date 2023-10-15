import { Stan } from 'node-nats-streaming'

enum Subjects {
  ExpirationComplete = 'expiration:complete',
}

interface Event {
  subject: Subjects
  data: any
}

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete
  data: {
    orderId: string
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

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}