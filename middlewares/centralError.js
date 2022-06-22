const { INTERVAL_SERVER_ERROR } = require('../constants');

module.exports = (err, req, res) => {
  const { statusCode = INTERVAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .json({
      status: 'error',
      statusCode,
      message: statusCode === INTERVAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
};
