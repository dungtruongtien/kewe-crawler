export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}


export class BusinessError extends Error {
  constructor(message, name = "BusinessError") {
    super(message);
    this.name = name;
    this.status = 400;
  }
}