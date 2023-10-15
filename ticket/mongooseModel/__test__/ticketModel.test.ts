import { Ticket } from '../ticketModel'

it('implementation optimistic mongo test', async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })
  //save the ticket to DB
  await ticket.save()
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)
  //make two separate changes to the tickets we fetch
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })
  //save the first fetch ticket
  await firstInstance!.save()
  //save the second fetch ticket and expect an error
  try {
    await secondInstance!.save()
  } catch (err) {
    return
  }

  throw new Error('Should not search this point')
})

it('increments the version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
