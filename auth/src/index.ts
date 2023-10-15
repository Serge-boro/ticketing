import mongoose from 'mongoose'
import { app } from './app'

const port = process.env.PORT || 3000
const start = async () => {
  console.log('Starting up...')
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connecting to MongoDB...')
    await app.listen(port, () => console.log(`Listening port ${port} ...!!!!`))
  } catch (err) {
    console.log(err)
  }
}

start()
