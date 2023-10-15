import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
  const [isErrors, setIsErrors] = useState(null)

  const doRequest = async () => {
    try {
      setIsErrors(null)
      const { data } = await axios[method](url, body)

      if (onSuccess && data) {
        onSuccess(data)
      }
      return data
    } catch (err) {
      setIsErrors(
        <div className='alert alert-danger'>
          <h4>...Oooops</h4>
          <ul className='my-0'>
            {err.response &&
              err.response.data.errors.map((item) => {
                return <li key={item.message}>{item.message}</li>
              })}
          </ul>
        </div>
      )
      //#1
      throw err
    }
  }

  return { doRequest, isErrors }
}
