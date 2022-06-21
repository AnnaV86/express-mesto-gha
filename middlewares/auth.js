const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const token = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  let payload;
  try {
    payload = jwt.verify(token.jwt, SECRET_KEY);
  } catch (error) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};
