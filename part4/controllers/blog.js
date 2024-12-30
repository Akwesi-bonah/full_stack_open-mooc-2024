const blogRouter = require("express").Router();
const { response } = require("express");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


blogRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const data = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = request.user

  const blog = new Blog({
    user: user._id,
    url: data.url,
    title: data.title,
    author: data.author,
  });

  const savedBlog = await blog.save();
  user.blog = user.blogs.concat(savedBlog);
  await user.save();

  response.json(savedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  try {
    // Decode the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    // Find the blog to be deleted
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    // Check if the blog's creator matches the token's user ID
    if (blog.user.toString() !== decodedToken.id) {
      return response.status(403).json({ error: "only the creator can delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: "malformed ID or validation error" });
  }
});


blogRouter.put("/:id", async (request, response) => {
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ error: "Malformed ID or validation error" });
  }
});

module.exports = blogRouter;
