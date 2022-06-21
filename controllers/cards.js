const Card = require('../models/card');
const { messagesError } = require('../utils/messagesError');
const {
  BAD_REQUEST,
  FORBIDDEN,
} = require('../constants');
const NotFoundError = require('../errors/not-found-err');
// const CastError = require('../errors/cast-error');
// const ValidationError = require('../errors/validation-error');

// Поиск всех карточек GET
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((result) => res.send(result))
    .catch(next);
};

// Создание карточки POST
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(async (card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные в полях: ${messagesError(error)}`,
        }));
      }
      next(error);
    });
};

// Удалить карточку по ID DELETE
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardID)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (String(card.owner._id) !== req.user._id) {
        next(res
          .status(FORBIDDEN)
          .send({ message: 'Запрет на удаление чужой карточки.' }));
      } else {
        card.remove();
        res.status(200).send({ message: 'Пост удалён' });
      }
    }).catch(next);
};

// Поставить лайк карточке PUT
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      next(error);
    });
};

// Убрать лайк DELETE
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
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
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      next(error);
    });
};
