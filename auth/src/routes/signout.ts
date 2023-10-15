import { Router } from 'express'

const router = Router()

router.post('/users/signout', (req, res) => {
  req.session = null
  res.status(201).json({})
})

export { router as signOutRouter }
