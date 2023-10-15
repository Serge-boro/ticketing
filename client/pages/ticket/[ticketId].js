import Router from 'next/router'
import useRequest from '../../hooks/use-request'
const TicketShow = ({ data }) => {
  const { ticket } = data
  console.log(data)
  const { doRequest, errors } = useRequest({
    url: '/api/order',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      Router.push('/order/[orderId]', `/order/${order.id}`), console.log(order)
    },
    // onSuccess: (order) => console.log(order),
  })

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, dataTicket) => {
  const { ticketId } = context.query
  const { data } = await dataTicket.get(`/api/ticket/${ticketId}`)

  return { data }
}
export default TicketShow
