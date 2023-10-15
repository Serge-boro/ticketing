import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const Signup = () => {
  const [isSignUp, setIsSignUp] = useState({
    email: '',
    password: '',
  })
  const { doRequest, isErrors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email: isSignUp.email,
      password: isSignUp.password,
    },
    onSuccess: () => Router.push('/auth/signin'),
  })

  const handleChanges = (e) => {
    setIsSignUp({ ...isSignUp, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(e)

    //   try {
    //     const { data } = await axios.post('/api/users/signup', {
    //       email: isSignUp.email,
    //       password: isSignUp.password,
    //     })
    //     console.log({ data })
    //   } catch (err) {
    //     setIsErrors(err.response.data.errors)
    //   }
    //   setIsSignUp({ email: '', password: '' })
    // }

    //hooks=>do-request.js
    //#1 redirect
    // await doRequest()
    // Router.push('/')

    //#2 onSuccess function redirect
    doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input
          // type='email'
          id='email'
          className='form-control'
          name='email'
          value={isSignUp.email}
          onChange={handleChanges}
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          className='form-control'
          name='password'
          value={isSignUp.password}
          onChange={handleChanges}
        />
      </div>
      {isErrors}
      <button className='btn btn-primary' style={{ marginTop: '1rem' }}>
        Sign Up
      </button>
    </form>
  )
}

export default Signup
