// model imports
require("../models/user.model")
require("../models/game.model")

// Require mongoose
const mongoose = require("mongoose");

// Get config environment variables
const config = require("./config");
const db = config.get("db");

// Connecting to mongoDB
const MongoUri = `mongodb+srv://${db.username}:${db.password}@cluster0.yz6uj.mongodb.net/${db.database}?retryWrites=true&w=majority`;
mongoose.connect(MongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

exports.connect = function (done) {
  mongoose.connection.on("connected", () => {
    console.log("Connected to mongo instance");
  });
  done();
};
