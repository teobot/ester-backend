const mongoose = require("mongoose");

const Game = mongoose.model("Game");

module.exports = async (req, res, next) => {
  // Get tournament ID

  const { gameId, joinCode } = req.body;

  if (!gameId && !joinCode) {
    //   User didn't specify a tournament id
    return res.status(401).send({ error: "game not specified" });
  }

  let game = null;

  if (gameId) {
    game = await Game.findById(gameId);
  } else if (joinCode) {
    game = await Game.findOne({ joinCode });
  }

  if (!game) {
    return res.status(401).send({ error: "game not found" });
  }

  req.game = game;

  next();
};
