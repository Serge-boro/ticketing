import useRequest from '../../hooks/use-request'
import { useEffect, useState } from 'react'
const TicketShow = ({ data: order }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  const findTimeLeft = () => {
    const msLeft = new Date(order.expiresAt) - new Date()
    setTimeLeft(Math.round(msLeft / 1000))
  }

  useEffect(() => {
    findTimeLeft()
    const timeId = setInterval(findTimeLeft, 1000)

    return () => clearInterval(timeId)
  }, [order])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return <>Time left ot pay -{timeLeft} s</>
}

TicketShow.getInitialProps = async (context, dataOrder) => {
  const { orderId } = context.query
  const { data } = await dataOrder.get(`/api/order/${orderId}`)

  return { data }
}
export default TicketShow
