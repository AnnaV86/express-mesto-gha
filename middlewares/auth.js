const jwt = require('jsonwebtoken');
const { UNAUTHORIZED, SECRET_KEY } = require('../constants');

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
    payload = jwt.verify(token.jwt, SECRET_KEY);
  } catch (error) {
    return handleAuthError(res);
  }
  req.user = payload;
  return next();
};
