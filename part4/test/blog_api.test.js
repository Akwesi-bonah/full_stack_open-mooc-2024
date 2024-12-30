const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

let token; // Token to be used for authenticated requests

beforeAll(async () => {
  // Clear users and create a new user for authentication
  await User.deleteMany({});
  const newUser = {
    username: "testuser",
    name: "Test User",
    password: "password123",
  };

  await api.post("/api/users").send(newUser);

  // Login to get the token
  const loginResponse = await api
    .post("/api/login")
    .send({ username: "testuser", password: "password123" });

  token = loginResponse.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = [
    {
      title: "First Blog",
      author: "Author One",
      url: "http://example.com/1",
      likes: 1,
    },
    {
      title: "Second Blog",
      author: "Author Two",
      url: "http://example.com/2",
      likes: 2,
    },
  ];

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("a valid blog can be added with a valid token", async () => {
  const newBlog = {
    title: "New Blog",
    author: "Test Author",
    url: "http://example.com/new",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`) // Include token
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await Blog.find({});
  expect(blogsAtEnd).toHaveLength(3);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain("New Blog");
});

test("adding a blog fails with status code 401 if token is missing", async () => {
  const newBlog = {
    title: "Unauthorized Blog",
    author: "Unauthorized Author",
    url: "http://example.com/unauthorized",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog) // No token provided
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await Blog.find({});
  expect(blogsAtEnd).toHaveLength(2);
});
