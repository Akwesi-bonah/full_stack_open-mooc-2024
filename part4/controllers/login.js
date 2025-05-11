const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  try {
    const { username, password } = request.body;

    // Validate request body
    if (!username || !password) {
      return response.status(400).json({
        error: "username and password are required",
      });
    }

    // Find user by username
    const user = await User.findOne({ username });

    // Verify password
    const passwordCorrect =
      user && (await bcrypt.compare(password, user.passwordHash));

    if (!user || !passwordCorrect) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    // Create token payload
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // Sign the token
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "1h", 
    });

    // Respond with token and user info
    response.status(200).json({
      token,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    response.status(500).json({
      error: "internal server error",
    });
  }
});

module.exports = loginRouter;
