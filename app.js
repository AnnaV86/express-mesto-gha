const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { validationUrl } = require('./utils/validationUrl');
const { INTERVAL_SERVER_ERROR } = require('./constants');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationUrl),
  }),
}), createUser);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use(errors());

app.use((err, req, res) => {
  console.log('err>>>>', err);
  const { statusCode = INTERVAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERVAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server start: ${PORT}`);
});
