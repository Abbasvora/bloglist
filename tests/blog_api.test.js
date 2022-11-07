const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogsObject = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogsObject.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there are some bolgs saved', () => {
  test('blogs are returened as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs unique identifier is named id', async () => {
    const response = await helper.blogsInDb(Blog)
    expect(response[0].id).toBeDefined()
  })
})


describe('adding new blog', () => {
  test('blog is added successfully', async () => {
    const blog = {
      'title': 'New JS Features',
      'author': 'James',
      'url': 'test.com/new-js/features',
      'likes': 25
    }
    await api.post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb(Blog)
    const titles = response.map((blog) => blog.title)

    expect(response.length).toBe(helper.initialBlogs.length + 1)
    expect(titles).toContain('New JS Features')

  })

  test('likes property missing in blog default to 0', async () => {
    const blog = {
      'title': 'New JS Features',
      'author': 'James',
      'url': 'test.com/new-js/features'
    }
    const response = await api.post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })
})

describe('blogs with missing data return 400', () => {
  test('title is missing', async () => {
    const blog = {
      'author': 'James',
      'url': 'test.com/new-js/features'
    }
    await api.post('/api/blogs')
      .send(blog)
      .expect(400)
  })
  test('url is missing', async () => {
    const blog = {
      'title': 'New JS Features',
      'author': 'James'
    }
    await api.post('/api/blogs')
      .send(blog)
      .expect(400)
  })
})

describe('deletion of blog', () => {
  test('succeds with code 204 when id is valid ', async () => {
    const blogsAtStart = await helper.blogsInDb(Blog)

    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb(Blog)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })
})

describe('update blog', () => {
  test('update likes of blog', async () => {
    const blogToUpdate = await helper.blogsInDb(Blog)

    const result = await api
      .put(`/api/blogs/${blogToUpdate[0].id}`)
      .send({ ...blogToUpdate, likes: 50 })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(result._body.likes).toBe(50)
  })
})

afterAll(() => mongoose.connection.close())