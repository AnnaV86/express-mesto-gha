const { BAD_REQUEST } = require('../constants');

class CastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = CastError;
