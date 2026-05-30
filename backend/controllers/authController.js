const authService = require("../services/authService");

class AuthController {
  async register(req, res, next) {
    try {
      const createdByRole = req.user?.role || null;
      await authService.register({ ...req.body, createdByRole });
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshAccessToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = req.headers["user-id"];

      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }

      await authService.logout(userId, refreshToken);
      return res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
