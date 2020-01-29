export class APIError extends Error {
  constructor(status = 500, message = `Unknown Server Error.`, data = {}) {
    super(message);
    this.status = status;
  }
}

export class UnauthorizedError extends APIError {
  constructor(message) {
    super(401, message);
  }
}

export class BadRequestError extends APIError {
  constructor(reason) {
    super(400, `Bad Request: ${reason}`);
  }
}

export class NotFoundError extends APIError {
  constructor(message) {
    super(404, message || 'Not Found');
  }
}
