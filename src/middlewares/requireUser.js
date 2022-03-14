const mongoose = require("mongoose");

const Game = mongoose.model("Game");

module.exports = async (req, res, next) => {
  let { userId } = req.body;

  if (!userId) {
    return res.status(422).send({ error: "userId is required" });
  }

  if (req.game.users === []) {
    return res.status(422).send({ error: "game has no users" });
  }

  let isUser = req.game.users.find((user) => user._id !== userId);

  // check if the user is in the game
  if (!isUser) {
    return res.status(422).send({ error: "You are not in this game." });
  }

  next();
};
