const config = require("./config.js");
const version = config.get("version");

const express = require("express");

const allowCrossOriginRequests = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
};

module.exports = function () {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(allowCrossOriginRequests);

  app.use((req, res, next) => {
    console.log(`##### ${req.method} ${req.path} #####`);
    next();
  });

  app.get("/api/" + version, function (req, res) {
    return res.send({ msg: "Server up" });
  });

  // Require all new routes here
  require("../routes/game.route")(app);
  require("../routes/user.route")(app);

  return app;
};
