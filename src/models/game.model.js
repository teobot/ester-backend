const mongoose = require("mongoose");

const User = require("./user.model");

const GameSchema = new mongoose.Schema({
  joinCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  creator: {
    type: User,
    required: true,
  },
  users: {
    type: [User],
    default: [],
  },
  reveal: {
    type: Boolean,
    default: false,
  },
  revote: {
    type: Boolean,
    default: false,
  },
});

GameSchema.methods.returnSafe = function (options = null) {
  // remove anything that is not safe to share
  const safeGame = this.toObject();

  // remove creator details
  delete safeGame.creator;

  if (options) {
    if (options.type === "mobile") {
      // remove the user data
      delete safeGame.users;
    }
  }

  if (safeGame.users) {
    // remove user ids
    safeGame.users = safeGame.users.map((user) => {
      // remove the user id and type from the return
      delete user._id;
      delete user.type;
      return user;
    });
  }

  // remove the join code and id of the game
  delete safeGame._id;

  // remove the version
  delete safeGame.__v;

  return safeGame;
};

GameSchema.methods.returnForUser = function (userId) {
  const safeGame = this.toObject();

  delete safeGame.creator;
  delete safeGame.users;

  delete safeGame.joinCode;

  // remove the version
  delete safeGame.__v;

  return safeGame;
};

mongoose.model(`Game`, GameSchema);
