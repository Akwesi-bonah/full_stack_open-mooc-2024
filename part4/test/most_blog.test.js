const { test, describe } = require("node:test");
const mostBlogs = require("../utils/list_helper").mostBlogs;
const assert = require("node:assert");

describe("mostBlogs", () => {
  test("when the list is empty", () => {
    const blogs = [];
    const result = mostBlogs(blogs);
    assert.strictEqual(result, null);
  });

  test("when there is only one blog", () => {
    const blogs = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        likes: 5,
        __v: 0,
      },
    ];
    const result = mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("when there are multiple blogs", () => {
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        likes: 7,
        __v: 0,
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        likes: 5,
        __v: 0,
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12,
        __v: 0,
      },
      {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        likes: 2,
        __v: 0,
      },
    ];
    const result = mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 2 });
  });
});
