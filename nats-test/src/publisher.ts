import nats, { Stan } from 'node-nats-streaming'

enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
}

interface Event {
  subject: Subjects
  data: any
}

interface TicketCreatedEvent {
  subject: Subjects.TicketCreated
  data: {
    id: string
    title: string
    price: number
    userId?: string
  }
}

// interface TicketCreatedEvent {
//   subject: Subjects.TicketCreated
//   data: {
//     id: string
//     title: string
//     price: number
//     userId: string
//   }
// }

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

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connect to NATS')

  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '1122',
      title: 'concert',
      price: 20,
    })
  } catch (err) {
    console.log(err)
  }
})
