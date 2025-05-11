const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

router.post('/reset', async (request, response) => {
  try {
    // Delete all Users
    await User.deleteMany({});
    console.log("All users deleted successfully");

    // Delete all Blogs
    await Blog.deleteMany({});
    console.log("All blogs deleted successfully");

    // Respond with success
    response.status(204).send();
  } catch (error) {
    console.error("Error resetting the database:", error.message);

    // Respond with error details
    response.status(500).json({ error: "Database reset failed" });
  }
});

module.exports = router;
