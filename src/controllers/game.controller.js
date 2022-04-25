var jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const socket = require("../config/socket");

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

const colors = [
  "#EDB9B9",
  "#EDE8B9",
  "#E6B9ED",
  "#BDB9ED",
  "#B9EDBE",
  "#B9DDED",
];

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

    return res.send({
      user: game.creator,
      game: game,
    });
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const updateGameStep = async (req, res) => {
  //  - updateGameStep
  try {
    req.game.step = req.body.step;

    req.io.sockets.emit(req.game._id, {
      type: "game:update",
    });

    await req.game.save();

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const updateGameMin = async (req, res) => {
  //  - updateGameMin
  try {
    req.game.minVote = req.body.min;

    req.io.sockets.emit(req.game._id, {
      type: "game:update",
    });

    await req.game.save();

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const updateGameMax = async (req, res) => {
  //  - updateGameMax
  try {
    req.game.maxVote = req.body.max;

    req.io.sockets.emit(req.game._id, {
      type: "game:update",
    });

    await req.game.save();

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const revealAnswer = async (req, res) => {
  //  - reveals the estimate to the job
  try {
    req.game.revote = false;
    req.game.reveal = true;

    // mark all users as not voted
    req.game.users.map((user) => {
      user.voted = false;
    });

    req.game.markModified("users");

    req.io.sockets.emit(req.game._id, {
      type: "game:reveal",
    });

    await req.game.save();

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const startRevote = async (req, res) => {
  //  - trigger a revote on the estimate
  try {
    req.game.revote = true;
    req.game.reveal = false;

    // mark all users as not voted
    req.game.users.map((user) => {
      user.voted = false;
    });

    req.game.markModified("users");

    req.io.sockets.emit(req.game._id, {
      type: "game:revote",
    });

    await req.game.save();

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const getGame = async (req, res) => {
  //  - get the game from the id
  try {
    const { userId } = req.body;

    // return different stuff based on what type the user is
    let isCreator = req.game.creator._id.toString() === userId;
    let isVoter = req.game.users.find((user) => user._id.toString() === userId)
      ? true
      : false;

    if (isCreator) {
      return res.send({
        user: req.game.creator,
        game: req.game,
      });
    } else if (isVoter) {
      return res.send({
        user: req.game.users.find((user) => user._id.toString() === userId),
        game: req.game.returnForUser(userId),
      });
    }
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const joinGame = async (req, res) => {
  //  - user wants to join a game
  try {
    const { name } = req.body;

    // take a random colour from the game colours list
    const userSelectedColour =
      req.game.availableColors[req.game.availableColors.length - 1];

    // remove the colour from the list
    req.game.availableColors.splice(
      req.game.availableColors.indexOf(userSelectedColour),
      1
    );

    const user = new User({
      name,
      color: userSelectedColour,
    });

    req.game.users.push(user);

    await req.game.save();

    await req.io.sockets.emit(req.game._id, {
      type: "user:joined",
    });

    return res.send({
      user,
      game: req.game.returnForUser(user._id),
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

    await req.io.sockets.emit(req.game._id, {
      type: "user:vote",
    });

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const undoVote = async (req, res) => {
  // - undo vote for a user
  try {
    const { userId } = req.body;

    // update if the user has voted
    req.game.users.map((user) => {
      if (user._id.toString() === userId) {
        user.voted = false;
      }
    });

    req.game.markModified("users");

    await req.game.save();

    await req.io.sockets.emit(req.game._id, {
      type: "game:update",
    });

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const kickUserFromGame = async (req, res) => {
  // - kick a user from the game
  try {
    const { kickId } = req.body;

    req.game.users = req.game.users.filter(
      (user) => user._id.toString() !== kickId
    );

    req.game.markModified("users");

    await req.game.save();

    return await getGame(req, res);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

const forceUpdateGame = async (req, res) => {
  //  - forceUpdateGame
  try {
    await req.io.sockets.emit(req.game._id, {
      type: "game:update",
    });

    return await getGame(req, res);
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
  kickUserFromGame,
  updateGameStep,
  updateGameMin,
  updateGameMax,
  forceUpdateGame,
  undoVote,
};
