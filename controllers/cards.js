const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERVAL_SERVER_ERROR } = require('../constants');
const { messagesError } = require('../utils');

// Поиск всех карточек GET
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((result) => res.send(result))
    .catch(() => res
      .status(INTERVAL_SERVER_ERROR)
      .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` }));
};

// Создание карточки POST
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(async (card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${messagesError(error)}`,
        });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};

// Удалить карточку по ID DELETE
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardID)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      res.send({ message: 'Пост удалён' });
    })

    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};

// Поставить лайк карточке PUT
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};

// Убрать лайк DELETE
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send({
        id: card.id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createAt: card.createAt,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res
        .status(INTERVAL_SERVER_ERROR)
        .send({ message: `${INTERVAL_SERVER_ERROR}: Ошибка сервера` });
    });
};
