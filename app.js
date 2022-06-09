const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const ERROR_DEFAULT = require("./controllers/users");

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "62a1b26850193a5e02cb8816",
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use("*", (req, res) => {
  try {
    throw "404 Страница не найдена";
  } catch (err) {
    return res.status(404).send({ message: "Что-то пошло не так..." });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server start: ${PORT}`);
});
