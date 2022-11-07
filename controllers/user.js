const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10

  const userInDb = await User.find({ username })
  if (userInDb.length !== 0) {
    return response.status(400).json({ error: 'This username is already taken.' })
  }

  if (!(password.length >= 3)) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.status(200).json(users)
})

module.exports = usersRouter