const _ = require("lodash");

const dummy = (blogs) => {
  // always returns 1
  return 1;
};

const totalLikes = (blogs) => {
  // sum all likes
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  return blogs.reduce((favorite, currentBlog) => {
    return currentBlog.likes > favorite.likes ? currentBlog : favorite;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogsByAuthor = _.countBy(blogs, "author");
  const authorWithMostBlogs = _.maxBy(
    Object.keys(blogsByAuthor),
    (author) => blogsByAuthor[author]
  );

  return {
    author: authorWithMostBlogs,
    blogs: blogsByAuthor[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const authorWithMostLikes = _.maxBy(
    Object.keys(likesByAuthor),
    (author) => likesByAuthor[author]
  );

  return {
    author: authorWithMostLikes,
    likes: likesByAuthor[authorWithMostLikes],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
