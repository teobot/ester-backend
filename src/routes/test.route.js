const config = require("../config/config");

const test = require("../controllers/test.controller");

const version = config.get("version");

module.exports = function (app) {
  app.route("/api/" + version + "/hello").get(test.hello);
};
