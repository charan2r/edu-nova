const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const instituteRepository = require("../repositories/instituteRepository");
const { AuthError, ValidationError } = require("../utils/errors");

class AuthService {
  // Register
  async register({
    fullname,
    email,
    password,
    confirmPassword,
    role,
    instituteId,
    createdByRole,
  }) {
    if (password !== confirmPassword) {
      throw new ValidationError("Passwords do not match");
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError("Email is already registered");
    }

    // institute_admin can only be created by super_admin
    if (role === "institute_admin" && createdByRole !== "super_admin") {
      throw new AuthError("Only super_admin can create institute admins");
    }

    // institute_admin must have instituteId
    if (role === "institute_admin" && !instituteId) {
      throw new ValidationError("Institute ID is required for institute_admin");
    }

    // Instructors need to select an institute at registration
    if (role === "instructor" && !instituteId) {
      throw new ValidationError("Instructors must select an institute");
    }

    // Validate institute exists if provided
    if (instituteId) {
      const institute = await instituteRepository.findById(instituteId);
      if (!institute) {
        throw new ValidationError("Institute not found");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullname,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "instructor" || role === "institute_admin") {
      userData.institute = instituteId;
    }

    return userRepository.create(userData);
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

    // Generate short-lived access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, institute: user.institute },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Generate long-lived refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    // Store refresh token in database
    user.refreshTokens.push(refreshToken);
    await user.save();

    return {
      accessToken,
      refreshToken,
      role: user.role,
      userId: user._id,
      institute: user.institute,
    };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new AuthError("Refresh token is required");
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const user = await userRepository.findById(decoded.id);

      if (!user || !user.refreshTokens.includes(refreshToken)) {
        throw new AuthError("Invalid or expired refresh token");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role, institute: user.institute },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AuthError("Invalid refresh token");
    }
  }

  async logout(userId, refreshToken) {
    const user = await userRepository.findById(userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken,
      );
      await user.save();
    }
  }
}

module.exports = new AuthService();
