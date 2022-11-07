const listHelper = require('../utils/helper')


describe('dummy', () => {
  test('dummy return one', () => {
    const result = listHelper.dummy([])
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([listHelper.listWithManyBlogs[0]])
    expect(result).toBe(7)
  })
  test('of a bigger list is calculated', () => {
    const result = listHelper.totalLikes(listHelper.listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite Blog', () => {
  test('favorite blog from many', () => {
    const result = listHelper.favoriteBLog(listHelper.listWithManyBlogs)
    const test = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    expect(result).toEqual(test)
  })
})

describe('most blogs', () => {
  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(listHelper.listWithManyBlogs)
    const test = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(result).toEqual(test)
  })
})
describe('most likes', () => {
  test('author with most liked blogs', () => {
    const result = listHelper.mostLikes(listHelper.listWithManyBlogs)
    const test = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(result).toEqual(test)
  })
})