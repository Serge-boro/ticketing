import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
  const [isTicket, setIsTicket] = useState({
    title: '',
    price: '',
  })

  const { doRequest, isErrors } = useRequest({
    url: '/api/ticket',
    method: 'post',
    body: {
      title: isTicket.title,
      price: isTicket.price,
    },
    onSuccess: () => Router.push('/'),
  })

  const handleChanges = (e) => {
    setIsTicket({ ...isTicket, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(e)
    doRequest()

    console.log({ isTicket })
  }

  const onBlur = () => {
    const value = parseFloat(isTicket.price)

    console.log(value)

    if (isNaN(value)) {
      return
    }

    setIsTicket({ ...isTicket, price: value.toFixed(2) })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a ticket</h1>
      <div className='form-group'>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          id='title'
          className='form-control'
          name='title'
          value={isTicket.title}
          onChange={handleChanges}
        />
      </div>
      <div className='form-group'>
        <label htmlFor='price'>Price</label>
        <input
          type='text'
          id='price'
          className='form-control'
          name='price'
          onBlur={onBlur}
          value={isTicket.price}
          onChange={handleChanges}
        />
      </div>
      {isErrors}
      <button className='btn btn-primary' style={{ marginTop: '1rem' }}>
        Submit
      </button>
    </form>
  )
}

export default NewTicket
