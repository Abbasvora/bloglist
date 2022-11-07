const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('../utils/helper')
const bcrypt = require('bcryptjs')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const userObject = helper.initialUsers.map(user => {
    const createUser = { ...user }
    const passwordHash = bcrypt.hashSync(createUser.password, saltRounds)
    createUser['passwordHash'] = passwordHash
    delete createUser.password

    return new User(createUser)
  })
  const promiseArray = userObject.map(user => user.save())
  await Promise.all(promiseArray)
})

describe('invalid creation of users', () => {
  test('user created with used username returns 400 error', async () => {
    const user = {
      name: 'James',
      username: helper.initialUsers[0].username,
      password: 'helloWorld'
    }
    const usersBefore = await helper.usersInDb()
    const result = await api.post('/api/users').send(user).expect(400)
    const usersAfter = await helper.usersInDb()
    expect(result.body.error).toBe('This username is already taken.')
    expect(usersAfter).toHaveLength(usersBefore.length)
  })
  test('user with username less than 3 characters returns code 400', async () => {
    const user = {
      name: 'James',
      username: '',
      password: 'helloWorld'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(400)

  })
})
afterAll(() => mongoose.connection.close())