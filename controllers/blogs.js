const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, id: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)
  const blogToAdd = { ...request.body, user: user.id }
  const blog = new Blog(blogToAdd)

  const result = await blog.save()
  user.blogs = user.blogs.concat(result.id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.put('/:id', middleware.extractUser, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const updateBlog = {
    ...request.body,
  }
  const blog = await Blog.findById(request.params.id).populate('user', { id: 1 })
  if (blog.user.id.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'you are not owner of this blog' })
  }
  await blog.updateOne(updateBlog, { new: true })
  return response.status(201).json({ ...updateBlog, id: blog.id })
})

blogsRouter.get('/:id', async (request, response) => {
  const result = await Blog.findById(request.params.id)
  response.status(200).json(result)
})

blogsRouter.delete('/:id', middleware.extractUser, async (request, response) => {
  const id = request.params.id
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(id).populate('user', { id: 1 })
  const blogUserId = blog.user.id
  if (blogUserId.toString() !== user.id.toString())
    return response.status(401).json({ error: 'you are not owner of this blog.' })
  await blog.remove()
  response.status(201).end()
})

module.exports = blogsRouter
