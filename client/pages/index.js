// import buildClient from '../api/build-client'
import Link from 'next/link'

const LandingPage = ({ currentUser, ticket }) => {
  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticket.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>
                  <Link href='/ticket/[ticketId]' as={`/ticket/${item.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Link href='/ticket/new'>TicketNew</Link>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/ticket')

  return { ticket: data }
}

export default LandingPage
