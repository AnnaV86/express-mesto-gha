const { FORBIDDEN } = require('../constants');

class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
