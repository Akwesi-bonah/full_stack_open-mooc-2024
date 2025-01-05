const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 3) {
    return res.status(400).json({ error: 'Username  must be at least 3 characters long' });
  }

  if (username.length < 3 ) {
    return res.status(400).json({ error: 'password must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username must be unique' });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = userRouter;
