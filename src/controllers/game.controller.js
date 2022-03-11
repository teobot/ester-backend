var jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const Game = mongoose.model("Game");
const User = mongoose.model("User");

const generateRandomJoinCode = () => {
  // generate a random join code
  // max length of 4
  // only include alphanumeric characters or numbers

  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let joinCode = "";
  let maxLength = 4;

  for (let i = 0; i < maxLength; i++) {
    joinCode += chars[Math.floor(Math.random() * chars.length)];
  }

  return joinCode;
};

const createGame = async (req, res) => {
  // - create a new game
  try {
    // keep generating a  join code until it is unique
    let joinCode = generateRandomJoinCode();

    while (await Game.findOne({ joinCode })) {
      joinCode = generateRandomJoinCode();
    }

    const game = new Game({
      joinCode,
      creator: new User({
        name: "John Doe",
        vote: 0,
        voted: false,
        type: "creator",
      }),
    });

    // save the game
    await game.save();

    return res.send(game.returnSafe());
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const revealAnswer = async (req, res) => {
  //  - reveals the estimate to the job
  try {
    req.game.reveal = !req.game.reveal;

    await req.game.save();

    return res.send(req.game.returnSafe());
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const startRevote = async (req, res) => {
  //  - trigger a revote on the estimate
  try {
    req.game.revote = !req.game.revote;

    await req.game.save();

    return res.send(req.game.returnSafe());
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const getGame = async (req, res) => {
  //  - get the game from the id
  try {
    return res.send(req.game.returnSafe());
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const joinGame = async (req, res) => {
  //  - user wants to join a game
  try {
    const { name } = req.body;

    const user = new User({
      name,
    });

    req.game.users.push(user);

    await req.game.save();

    return res.send({
      user: {
        userId: user._id,
        name: user.name,
      },
      game: req.game.returnSafe(),
    });
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const userVote = async (req, res) => {
  //  - user votes on a job
  try {
    const { userId, vote } = req.body;

    // update the vote of the user
    req.game.users.map((user) => {
      if (user._id.toString() === userId) {
        user.vote = vote;
        user.voted = true;
      }
    });

    req.game.markModified("users");

    await req.game.save();

    return res.send(req.game.returnSafe());
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const kickUserFromGame = async (req, res) => {
  // - kick a user from the game
  try {
    const { username } = req.body;

    const user = req.game.users.find((user) => user.name === username);

    if (!user) {
      return res.status(422).send({ error: "User not found" });
    }

    req.game.users = req.game.users.filter((user) => user.name !== username);

    req.game.markModified("users");

    await req.game.save();

    return res.send(req.game.returnSafe());
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

module.exports = {
  createGame,
  revealAnswer,
  startRevote,
  getGame,
  joinGame,
  userVote,
  kickUserFromGame
};
