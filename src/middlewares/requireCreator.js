const mongoose = require("mongoose");

const Game = mongoose.model("Game");

module.exports = async (req, res, next) => {
  let { game } = req;
  let { userId } = req.body;

  if (game.creator._id.toString() !== userId) {
    return res
      .status(422)
      .send({ error: "You are not the creator of this game." });
  }

  next();
};
