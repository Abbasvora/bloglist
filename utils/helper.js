const _ = require('lodash')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

const initialUsers = [
  {
    name: 'James Andrew',
    username: 'jamesA',
    password: 'nhiunb2458'
  },
  {
    name: 'Robert Muller',
    username: 'robert',
    password: 'unmioen596'
  }
]

const dummy = (blog) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, next) => {
    return sum + next.likes
  }, 0)
  return total
}

const favoriteBLog = (blogs) => {
  blogs.sort((a, b) => b.likes - a.likes)
  const author = blogs[0].author
  const title = blogs[0].title
  const likes = blogs[0].likes
  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  const reducedBlogs = _.reduce(blogs, (result, value) => {
    result[value.author] ? result[value.author]++ : result[value.author] = 1
    return result
  }, {})
  const sorted = Object.entries(reducedBlogs).sort((a, b) => b[1] - a[1])[0]
  return { author: sorted[0], blogs: sorted[1] }
}

const mostLikes = (blogs) => {
  const reducedBlogs = _.reduce(blogs, (result, value) => {
    result[value.author] ? result[value.author] += value.likes : result[value.author] = value.likes
    return result
  }, {})
  const sorted = Object.entries(reducedBlogs).sort((a, b) => b[1] - a[1])[0]
  return { author: sorted[0], likes: sorted[1] }
}

const blogsInDb = async (Blog) => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBLog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb,
  initialBlogs,
  initialUsers
}
