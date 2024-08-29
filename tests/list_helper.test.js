// tests/list_helper.test.js
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')



describe('most likes', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      url: 'https://mitpress.mit.edu/books/introduction-algorithms',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      url: 'https://www.pearson.com/store/p/artificial-intelligence-a-modern-approach/P100000266349',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fb',
      title: 'Introduction to the Theory of Computation',
      author: 'Michael Sipser',
      url: 'https://www.cengage.com/c/introduction-to-the-theory-of-computation-3e-sipser/9781133187790',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fc',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma',
      url: 'https://www.pearson.com/store/p/design-patterns/P100000071585',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fd',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      url: 'https://www.pearson.com/store/p/clean-code/P100000285490',
      likes: 2,
      __v: 0
    }
  ]

  test('when list has multiple blogs, returns the author with most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Thomas H. Cormen',
      likes: 10
    })
  })
  const listWithNoBlogs = []

  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes(listWithNoBlogs)
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Introduction to Algorithms',
      author: 'Edsger W. Dijkstra',
      url: 'https://mitpress.mit.edu/books/introduction-algorithms',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      url: 'https://www.pearson.com/store/p/artificial-intelligence-a-modern-approach/P100000266349',
      likes: 7,
      __v: 0
    }
  ]
  test('when list has multiple blogs, equals the author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    })
  })

  const listWithNoBlogs = []

  test('when list is empty, equals null', () => {
    const result = listHelper.mostBlogs(listWithNoBlogs)
    assert.strictEqual(result, null)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test ('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      url: 'https://mitpress.mit.edu/books/introduction-algorithms',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      url: 'https://www.pearson.com/store/p/artificial-intelligence-a-modern-approach/P100000266349',
      likes: 7,
      __v: 0
    }
  ]

  test('when list has multiple blogs, equals the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      likes: 10
    })
  })

  const listWithNoBlogs = []

  test('when list is empty, equals null', () => {
    const result = listHelper.favoriteBlog(listWithNoBlogs)
    assert.strictEqual(result, null)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      url: 'https://mitpress.mit.edu/books/introduction-algorithms',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Artificial Intelligence: A Modern Approach',
      author: 'Stuart Russell',
      url: 'https://www.pearson.com/store/p/artificial-intelligence-a-modern-approach/P100000266349',
      likes: 7,
      __v: 0
    }
  ]

  test('when list has multiple blogs, equals the sum of all likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 22)
  })

  const listWithNoBlogs = []

  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    assert.strictEqual(result, 0)
  })
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})