const { UNAUTHORIZED } = require('../constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
