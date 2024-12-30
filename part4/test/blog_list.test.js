const { test, describe, after, beforeEach } = require("node:test");
const Blog = require("../models/blog");
const assert = require("node:assert");
const mongoose = require('mongoose')

const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const initialBlogs = [
    {
      title: "First Blog",
      author: "Author One",
      url: "http://example1.com",
      likes: 5,
    },
    {
      title: "Second Blog",
      author: "Author Two",
      url: "http://example2.com",
      likes: 10,
    },
  ];

  await Blog.insertMany(initialBlogs);
});

describe("Blog list tests", () => {
  test("Blogs are returned as JSON and correct number of blogs is returned", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, 2);
    assert.strictEqual(response.body[0].title, "First Blog");
  });
});



describe("Blog unique identifier tests", () => {
  test("Blogs have a unique identifier property named 'id'", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogs = response.body;
    assert.strictEqual(blogs.length, 2);

    assert.ok(blogs[0].id);
    assert.strictEqual(blogs[0]._id, undefined);
  });
});

describe("Blog creation tests", () => {
  test("A new blog can be added via POST request", async () => {
    const newBlog = {
      title: "New Blog",
      author: "Author Two",
      url: "http://example2.com",
      likes: 7,
    };

    const initialBlogs = await Blog.find({});
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await Blog.find({});
    assert.strictEqual(blogsAfterPost.length, initialBlogs.length + 1);

    const titles = blogsAfterPost.map((blog) => blog.title);
    assert.ok(titles.includes(newBlog.title));
  });
});

describe("Default value for likes property", () => {
    test("If likes property is missing, it defaults to 0", async () => {
      const newBlog = {
        title: "Blog Without Likes",
        author: "Author Three",
        url: "http://example3.com",
      };
  
      const response = await api.post("/api/blogs").send(newBlog).expect(201).expect("Content-Type", /application\/json/);
  
      assert.strictEqual(response.body.likes, 0); // Verify likes default to 0
    });
  });

  describe("Validation for required fields", () => {
    test("Fails with status code 400 if title is missing", async () => {
      const newBlog = {
        title: "Example",
        author: "Author Four",
        url: "http://example4.com",
        likes: 5,
      };
  
      await api.post("/api/blogs").send(newBlog).expect(400);
    });
  
    test("Fails with status code 400 if url is missing", async () => {
      const newBlog = {
        title: "Blog Without URL",
        author: "Author Five",
        likes: 5,
      };
  
      await api.post("/api/blogs").send(newBlog).expect(400);
    });
  });
  
  describe('Deleting a blog', () => {
    test('Successfully deletes an existing blog', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToDelete = blogsAtStart[0];
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);
  
      const blogsAtEnd = await Blog.find({});
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  
      const titles = blogsAtEnd.map(blog => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });
  
    test('Returns 404 if the blog does not exist', async () => {
      const validNonExistingId = await Blog.nonExistingId();
  
      await api
        .delete(`/api/blogs/${validNonExistingId}`)
        .expect(404);
    });
  
    test('Returns 400 if the ID is malformed', async () => {
      const malformedId = '123invalidid';
  
      await api
        .delete(`/api/blogs/${malformedId}`)
        .expect(400);
    });
  });
  
  describe('Updating a blog', () => {
    test('Successfully updates likes of an existing blog', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToUpdate = blogsAtStart[0];
  
      const updatedBlog = { likes: blogToUpdate.likes + 1 };
  
      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);
  
      expect(response.body.likes).toBe(blogToUpdate.likes + 1);
  
      const blogsAtEnd = await Blog.find({});
      const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
      expect(updatedBlogInDb.likes).toBe(blogToUpdate.likes + 1);
    });
  
    test('Returns 404 if the blog does not exist', async () => {
      const validNonExistingId = await Blog.nonExistingId();
      const updatedBlog = { likes: 10 };
  
      await api
        .put(`/api/blogs/${validNonExistingId}`)
        .send(updatedBlog)
        .expect(404);
    });
  
    test('Returns 400 if the ID is malformed', async () => {
      const malformedId = '123invalidid';
      const updatedBlog = { likes: 10 };
  
      await api
        .put(`/api/blogs/${malformedId}`)
        .send(updatedBlog)
        .expect(400);
    });
  });
  

  after(async () => {
    await mongoose.connection.close();
  });
  