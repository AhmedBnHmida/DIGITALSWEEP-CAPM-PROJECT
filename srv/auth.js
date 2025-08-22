const cds = require('@sap/cds');
const bcrypt = require('bcryptjs');

module.exports = cds.service.impl(async function () {
  const { Users } = this.entities;

  // 🔹 Automatically hash password before persisting user
  this.before('CREATE', Users, async (req) => {
    if (req.data.password) {
      const salt = await bcrypt.genSalt(10);
      req.data.password = await bcrypt.hash(req.data.password, salt);
      req.data.createdAt = new Date().toISOString();
    }
  });

  // 🔹 Custom Register action
  this.on('register', async (req) => {
    const { username, email, password } = req.data;

    // Check if user already exists
    const existing = await SELECT.one.from(Users).where({ username });
    if (existing) return req.reject(400, 'Username already taken');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const { ID } = await INSERT.into(Users).entries({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    return { message: 'Registration successful', userId: ID };
  });

  // 🔹 Custom Login action
  this.on('login', async (req) => {
    const { username, password } = req.data;

    const user = await SELECT.one.from(Users).where({ username });
    if (!user) return req.reject(401, 'Invalid username or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return req.reject(401, 'Invalid username or password');

    return { message: 'Login successful', userId: user.ID };
  });
});
