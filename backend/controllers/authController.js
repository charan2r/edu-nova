const authService = require("../services/authService");

class AuthController {
  async register(req, res, next) {
    try {
      await authService.register(req.body);
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
}

module.exports = new AuthController();
