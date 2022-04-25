const config = require("../config/config");

const controller = require("../controllers/game.controller");

const version = config.get("version");

const requireGame = require("../middlewares/requireGame");
const requireCreator = require("../middlewares/requireCreator");
const requireUser = require("../middlewares/requireUser");

module.exports = function (app, io) {
  // assign io to all routes
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Get game and pass io to the controller function
  app
    .route("/api/" + version + "/get/game")
    .post(requireGame, controller.getGame);

  // create game
  app.route("/api/" + version + "/create/game").post(controller.createGame);

  // reveal answers
  app
    .route("/api/" + version + "/game/reveal")
    .post(requireGame, requireCreator, controller.revealAnswer);

  // start revote
  app
    .route("/api/" + version + "/game/revote")
    .post(requireGame, requireCreator, controller.startRevote);

  // join a game
  app
    .route("/api/" + version + "/game/join")
    .post(requireGame, controller.joinGame);

  // save user vote
  app
    .route("/api/" + version + "/game/vote")
    .post(requireGame, requireUser, controller.userVote);

  // remove user from game
  app
    .route("/api/" + version + "/game/user/kick")
    .post(requireGame, requireCreator, controller.kickUserFromGame);

  // kick user from game
  app
    .route("/api/" + version + "/game/user/remove")
    .post(requireGame, requireCreator, controller.kickUserFromGame);

  // update game step
  app
    .route("/api/" + version + "/game/step")
    .post(requireGame, requireCreator, controller.updateGameStep);

  // update game min
  app
    .route("/api/" + version + "/game/min")
    .post(requireGame, requireCreator, controller.updateGameMin);

  // update game max
  app
    .route("/api/" + version + "/game/max")
    .post(requireGame, requireCreator, controller.updateGameMax);

  // force update game
  app
    .route("/api/" + version + "/game/force")
    .post(requireGame, requireCreator, controller.forceUpdateGame);

  // undo a users vote
  app
    .route("/api/" + version + "/user/vote/undo")
    .post(requireGame, requireUser, controller.undoVote);
};
