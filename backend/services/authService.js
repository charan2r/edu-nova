const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { AuthError, ValidationError } = require("../utils/errors");

class AuthService {
  async register({ fullname, email, password, confirmPassword, role }) {
    if (password !== confirmPassword) {
      throw new ValidationError("Passwords do not match");
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return userRepository.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return { token, role: user.role };
  }
}

module.exports = new AuthService();
