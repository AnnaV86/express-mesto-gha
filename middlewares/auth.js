const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { UNAUTHORIZED } = require('../constants');

const handleAuthError = (res) => {
  res
    .status(UNAUTHORIZED)
    .send({ message: 'Ошибка авторизации' });
};

module.exports = (req, res, next) => {
  const token = req.cookies;
  if (!token) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = jwt.verify(token.jwt, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    return handleAuthError(res);
  }
  req.user = payload;
  return next();
};
