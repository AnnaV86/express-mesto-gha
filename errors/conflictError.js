const { NOT_FOUND: CONFLICT } = require('../constants');

class ConflictError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
