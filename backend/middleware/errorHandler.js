const errorHandler = (err, req, res, next) => {
  console.error(err);
  try {
    if (err.name === "AuthError") {
      return res.status(401).json({
        success: false,
        errorType: "AuthError",
        error: err.message,
        message: err.message,
      });
    }
    if (err.name === "CustomError") {
      return res.status(401).json({
        success: false,
        errorType: "CustomError",
        error: err.message,
        message: err.message,
      });
    }

    if (err.name === "ValidationError") {
      const validationErrors = Object.entries(err?.errors)?.map(
        ([field, err]) => ({
          field,
          message: err.message,
        }),
      );
      return res.status(400).json({
        success: false,
        errorType: "ValidationError",
        message: err.message,
        errors: validationErrors,
      });
    }

    if (err.name === "JWTError") {
      return res.status(401).json({
        success: false,
        errorType: "JWTError",
        error: err.message,
        message: err.message,
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        errorType: "JWTError",
        error: err.message,
        message: "authorization failed,Please login again.......",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        errorType: "JWTError",
        error: err.message,
        message: "Invalid token",
      });
    } else {
      return res.status(500).json({
        success: false,
        err,
        errorType: "InternalError",
        message: "Internal server error",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      err,
      errorType: "InternalError",
      message: "Internal server error",
    });
  }
};

function methodNotAllowed(req, res, next) {
  const error = {
    status: 405,
    message: "Method Not Allowed",
    details: `The ${req.method} method is not allowed on ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  };
  res.status(405).json(error);
}

module.exports = { errorHandler, methodNotAllowed };
