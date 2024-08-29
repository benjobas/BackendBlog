const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


const initialBlogs = [
  {
      title: 'First Blog',
      author: 'Author One',
      url: 'http://example.com/1',
      likes: 1
  },
  {
      title: 'Second Blog',
      author: 'Author Two',
      url: 'http://example.com/2',
      likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs have an id property instead of _id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert(blog.id)
    assert(!blog._id)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Third Blog',
    author: 'Author Three',
    url: 'http://example.com/3',
    likes: 3
  }
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const finalBlogs = await Blog.find({})
  assert.strictEqual(finalBlogs[2].title, 'Third Blog')
  assert.strictEqual(finalBlogs[2].author, 'Author Three')
  assert.strictEqual(finalBlogs.length, initialBlogs.length + 1)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('blog without likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Author noLikes',
    url: 'http://example.com/noLikes'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const finalBlogs = await Blog.find({})
  assert.strictEqual(finalBlogs[2].likes, 0)
})

test('blog without title or url is not added', async () => {
  const newBlogWithoutTitle = {
    author: 'Author noTitle',
    url: 'http://example.com/noTitle',
    likes: 0
  }
  const newBlogWithoutUrl = {
    title: 'Blog Without Url',
    author: 'Author noUrl',
    likes: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)

  const finalBlogs = await Blog.find({})
  assert.strictEqual(finalBlogs.length, initialBlogs.length)
})



after(async () => {
  await mongoose.connection.close()
})