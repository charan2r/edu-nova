const rateLimit = require("express-rate-limit");

// General API rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => process.env.NODE_ENV === "development", // Skip rate limiting in development
});

// Strict rate limiter for authentication: 5 requests per 15 minutes per email
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use email as the key if provided, otherwise use IP
    return req.body?.email || req.ip;
  },
  skip: (req) => process.env.NODE_ENV === "development",
});

// Moderate rate limiter for file uploads: 20 requests per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many uploads, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development",
});

// Moderate rate limiter for course creation: 10 courses per hour per instructor
const courseCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many course creations, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.id || req.ip;
  },
  skip: (req) => process.env.NODE_ENV === "development",
});

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  courseCreationLimiter,
};
