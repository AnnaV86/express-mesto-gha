const { NOT_FOUND } = require('../constants');

class NotFoundError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundError;
