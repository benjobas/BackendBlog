const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) => {
    return (current.likes > prev.likes) ? current : prev
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCount = blogs.reduce((authors, blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
    return authors
  }, {})

  const mostBlogsAuthor = Object.keys(authorCount).reduce((prev, current) => 
    authorCount[current] > authorCount[prev] ? current : prev
  )

  return {
    author: mostBlogsAuthor,
    blogs: authorCount[mostBlogsAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = blogs.reduce((authors, blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
    return authors
  }, {})

  const mostLikesAuthor = Object.keys(authorLikes).reduce((prev, current) =>
    authorLikes[current] > authorLikes[prev] ? current : prev
  )

  return {
    author: mostLikesAuthor,
    likes: authorLikes[mostLikesAuthor]
  }
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }