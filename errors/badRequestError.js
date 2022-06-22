const { BAD_REQUEST } = require('../constants');

class BadRequestError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestError;
