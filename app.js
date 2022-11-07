const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to server'))
  .catch((error) => logger.error(error))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
