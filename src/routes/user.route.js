const config = require("../config/config");

const controller = require("../controllers/user.controller");

const version = config.get("version");

module.exports = function (app) {
  // app.route("/api/" + version + "/create/user").post(controller.createUser);
};
