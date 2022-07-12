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
  minVote: {
    type: Number,
    default: 0.5,
  },
  maxVote: {
    type: Number,
    default: 4,
  },
  step: {
    type: Number,
    default: 0.5,
  },
  additionMarker: {
    type: Array,
    default: [
      {
        value: 0.1,
        label: "0.1",
      },
      {
        value: 0.25,
        label: "0.25",
      },
    ],
  },
  availableColors: {
    type: [String],
    default: [
      "#77dd77",
      "#836953",
      "#89cff0",
      "#99c5c4",
      "#9adedb",
      "#aa9499",
      "#aaf0d1",
      "#b2fba5",
      "#b39eb5",
      "#bdb0d0",
      "#bee7a5",
      "#befd73",
      "#c1c6fc",
      "#c6a4a4",
      "#c8ffb0",
      "#cb99c9",
      "#cef0cc",
      "#cfcfc4",
      "#d6fffe",
      "#d8a1c4",
      "#dea5a4",
      "#deece1",
      "#dfd8e1",
      "#e5d9d3",
      "#e9d1bf",
      "#f49ac2",
      "#f4bfff",
      "#fdfd96",
      "#ff6961",
      "#ff964f",
      "#ff9899",
      "#ffb7ce",
      "#ca9bf7",
    ],
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
