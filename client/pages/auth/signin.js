import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const Signup = () => {
  const [isSignIn, setIsSignIn] = useState({
    email: '',
    password: '',
  })
  const { doRequest, isErrors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email: isSignIn.email,
      password: isSignIn.password,
    },
    onSuccess: () => Router.push('/'),
  })

  const handleChanges = (e) => {
    setIsSignIn({ ...isSignIn, [e.target.name]: e.target.value })
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
    //hooks/use-request.js.
    doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input
          // type='email'
          id='email'
          className='form-control'
          name='email'
          value={isSignIn.email}
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
          value={isSignIn.password}
          onChange={handleChanges}
        />
      </div>
      {isErrors}
      <button className='btn btn-primary' style={{ marginTop: '1rem' }}>
        Sign In
      </button>
    </form>
  )
}

export default Signup
