const router = require("express").Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards", createCard);
router.delete("/cards/:cardID", deleteCard);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
