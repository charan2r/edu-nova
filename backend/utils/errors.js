class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
    console.log(this);
  }
}

class JWTError extends Error {
  constructor(message) {
    super(message);
    this.name = "JWTError";
  }
}

module.exports = {
  AuthError,
  ValidationError,
  NotFoundError,
  CustomError,
  JWTError,
};
