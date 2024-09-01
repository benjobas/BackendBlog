const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 });
  response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes} = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }
  const user = request.user;

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
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "Unauthorized" });
  }

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
