const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST,
  // NOT_FOUND,
  CONFLICT,
  // INTERVAL_SERVER_ERROR,
  SECRET_KEY,
} = require('../constants');
const { messagesError } = require('../utils/messagesError');
const NotFoundError = require('../errors/not-found-err');
// const CastError = require('../errors/cast-error');
// const ValidationError = require('../errors/validation-error');
// const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

// Контроллер login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

// Получение информации о пользователе GET users/me
module.exports.getProfile = (req, res, next) => User
  .findOne(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.send(user);
  })
  .catch(next);

// Поиск всех пользователей GET
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((result) => res.send(result))
    .catch(next);
};

// Поиск пользователя по ID GET
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Передан некорректный id пользователя' });
        // next(new CastError('Передан некорректный id пользователя'));
      } next(error);
    });
};

// Создание нового пользователя POST
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${messagesError(error)}`,
        }));
      } else if (error.code === 11000) {
        next(res.status(CONFLICT).send({
          message: 'Пользователем с данным email уже зарегистрирован',
        }));
      }
      next(error);
    });
};

// Редактирование данных пользователя PATCH

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${messagesError(error)}`,
        }));
      }
      next(error);
    });
};

// Редактирование аватара пользователя PATCH
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${messagesError(error)}`,
        }));
      }
      next(error);
    });
};
