const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  await Blog.findById(request.params.id);
  response.status(204).end();
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes, userId} = request.body;
  const user = await User.findById(userId);

  if (!title || !url) {
    return response.status(400).json({ error: "Title or URL is missing" });
  } 
  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }
  
    const blog = new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes === undefined ? 0 : likes,
      user: user.id
    })
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save();
    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
})
module.exports = blogsRouter;
