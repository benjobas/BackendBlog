const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

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

test ('a blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]
  const updatedBlog = {
    title: 'Updated Blog',
    author: 'Updated Author',
    url: 'http://example.com/updated',
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await Blog.find({})
  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('Updated Blog'))
  assert(!titles.includes(blogToUpdate.title))
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
          username: 'benjobas',
          name: 'Benjamin Sanchez',
          password: 'contraseña',
      }

      await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

  test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('`username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})