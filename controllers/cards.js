const Card = require("../models/card");
const ERROR_CODE = 400;
const ERROR_SEARCH = 404;
const ERROR_DEFAULT = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((result) => res.send({ result }))
    .catch((error) =>
      res.status(ERROR_DEFAULT).send({ message: error.message })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardID)
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_SEARCH)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      res.send({ data: card });
    })

    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Передан некорректный id карточки" });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_SEARCH)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные для постановки лайка",
          });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_SEARCH)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Переданы некорректные данные для снятия лайка" });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: error.message });
      }
    });
};