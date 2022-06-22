const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Ошибка авторизации');
  }
  let payload;
  try {
    payload = jwt.verify(token.jwt, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    next(new UnauthorizedError('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};
