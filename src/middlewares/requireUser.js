const mongoose = require("mongoose");

const Game = mongoose.model("Game");

module.exports = async (req, res, next) => {
  let { game } = req;
  let { userId } = req.body;

  if (!userId) {
    return res.status(422).send({ error: "userId is required" });
  }

  if (game.users === []) {
    return res.status(422).send({ error: "game has no users" });
  }

  // check if the user is in the game
  if (game.users.find((user) => user._id.toString() !== userId)) {
    return res.status(422).send({ error: "You are not in this game." });
  }

  next();
};
