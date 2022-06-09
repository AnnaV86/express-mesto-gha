const User = require("../models/user");
const ERROR_CODE = 400;
const ERROR_SEARCH = 404;
const ERROR_DEFAULT = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((result) => res.send(result))
    .catch((error) =>
      res.status(ERROR_DEFAULT).send({ message: error.message })
    );
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_SEARCH)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Передан некорректный id пользователя" });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })
    )
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_SEARCH)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные пользователя",
        });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_SEARCH)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные пользователя",
        });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};
