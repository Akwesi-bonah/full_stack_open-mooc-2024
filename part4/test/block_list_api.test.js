const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const app = require("../app");
const api = supertest(app);
const assert = require("node:assert");

const InitialBlog = [
  {
    title: "React patterns",
    author: "Michael Chan",
    likes: 7,
    url: "https://reactpatterns.com/",
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    likes: 5,
    url: "https://topperKlass.com",
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log("cleared");

  const blogPromises = InitialBlog.map((blog) => {
    let blogObject = new Blog(blog);
    return blogObject.save();
  });

  await Promise.all(blogPromises);
  console.log("done");
});

describe("test GET API request", () => {
  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.status, 200);
    assert.match(response.headers["content-type"], /application\/json/);
  });

  test("check if all blogs have expected id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogs = response.body;
    assert.strictEqual(
      blogs.length,
      InitialBlog.length,
      "The number of blogs should match the initial data"
    );

    blogs.forEach((blog) => {
      assert.ok(blog.id, "Each blog should have an id");
      assert.strictEqual(
        blog._id,
        undefined,
        "The _id field should not be present"
      );
    });
  });

  test("a valid blog post can be added", async () => {
    const newBlog = {
      title: "New Blog Post",
      author: "Test Author",
      url: "https://topperKlass.com",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, InitialBlog.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    assert.ok(
      titles.includes(newBlog.title),
      "The new blog title should be in the list"
    );
  });
  test("a valid blog post without likes defaults to 0", async () => {
    const newBlog = {
      title: "New Blog Post Without Likes",
      author: "Test Author",
      url: "https://newblog.com",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const savedBlog = response.body;
    assert.strictEqual(
      savedBlog.likes,
      0,
      "The likes should default to 0 when not provided"
    );
  });

  test("fails with status code 400 if title is missing", async () => {
    const newBlog = {
      author: "Test Author",
      url: "https://newblog.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    // Optionally verify that the blog count hasn't increased
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(
      blogsAtEnd.length,
      InitialBlog.length,
      "The number of blogs should remain unchanged"
    );
  });

  test("fails with status code 400 if url is missing", async () => {
    const newBlog = {
      title: "Blog without URL",
      author: "Test Author",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    // Optionally verify that the blog count hasn't increased
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(
      blogsAtEnd.length,
      InitialBlog.length,
      "The number of blogs should remain unchanged"
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
