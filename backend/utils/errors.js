export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}
export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
    console.log(this);
  }
}
export class JWTError extends Error {
  constructor(message) {
    super(message);
    this.name = "JWTError";
  }
}
