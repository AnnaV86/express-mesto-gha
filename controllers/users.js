const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERVAL_SERVER_ERROR,
} = require('../constants');

// Поиск всех пользователей GET
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((result) => res.send(result))
    .catch(() => res
      .status(INTERVAL_SERVER_ERROR)
      .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` }));
};

// Поиск пользователя по ID GET
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Передан некорректный id пользователя' });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};

// Создание нового пользователя POST
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${Object.keys(
            error.errors,
          )}`,
        });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};

// Редактирование данных пользователя PATCH
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${Object.keys(
            error.errors,
          )}`,
        });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};

// Редактирование аватара пользователя PATCH
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полe: ${Object.keys(
            error.errors,
          )}`,
        });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};
