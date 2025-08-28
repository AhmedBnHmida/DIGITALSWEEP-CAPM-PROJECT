const cds = require('@sap/cds');
const bcrypt = require('bcryptjs');

module.exports = cds.service.impl(async function () {
  const { Users } = this.entities;

  // 🔹 Hash password before persisting
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

    // ✅ Input validation
    if (!username) return req.reject(400, { code: "40001", message: "Username is required" });
    if (!email) return req.reject(400, { code: "40002", message: "Email is required" });
    if (!/\S+@\S+\.\S+/.test(email)) return req.reject(400, { code: "40003", message: "Invalid email format" });
    if (!password) return req.reject(400, { code: "40004", message: "Password is required" });
    if (password.length < 6) return req.reject(400, { code: "40005", message: "Password must be at least 6 characters" });

    // ✅ Email uniqueness
    const existingEmail = await SELECT.one.from(Users).where({ email });
    if (existingEmail) return req.reject(400, { code: "40004", message: "Email already registered" });

    // ✅ Username uniqueness
    const existingUser = await SELECT.one.from(Users).where({ username });
    if (existingUser) return req.reject(400, { code: "40005", message: "Username already taken" });

    // ✅ Hash password & insert
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { ID } = await INSERT.into(Users).entries({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    return { message: "Registration successful", userId: ID };
  });

  // 🔹 Custom Login action
  this.on('login', async (req) => {
    const { email, password } = req.data;

    // ✅ Input validation
    if (!email) return req.reject(400, { code: "40001", message: "Email is required" });
    if (!/\S+@\S+\.\S+/.test(email)) return req.reject(400, { code: "40002", message: "Invalid email format" });
    if (!password) return req.reject(400, { code: "40003", message: "Password is required" });

    // ✅ Check existence by email
    const user = await SELECT.one.from(Users).where({ email });
    if (!user) return req.reject(401, { code: "40101", message: "No account found with this email" });

    // ✅ Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return req.reject(401, { code: "40102", message: "Incorrect password" });

    return { message: "Login successful", userId: user.ID };
  });


  this.on('updateUser', async (req) => {
      const { ID, username, password } = req.data;

      // Check if username is unique
      if (username) {
          const existing = await SELECT.one.from(Users)
              .where({ username })
              .and({ ID: { '<>': ID } });
          if (existing) return req.reject(400, "Username already taken");
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (password) updateData.password = await bcrypt.hash(password, 10);

      await UPDATE(Users).set(updateData).where({ ID });

      return { message: "User updated successfully" };
  });


  
});
