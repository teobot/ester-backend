const dotenv = require("dotenv").config(),
  config = require("./src/config/config"),
  express = require("./src/config/express"),
  db = require("./src/config/db"),
  version = config.get("version"),
  { createServer } = require("http"),
  { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
});

// Require all new routes here
require("./src/routes/game.route")(app, io);

db.connect(function (err) {
  if (err) {
    console.log("Unable to connect to MongoDB");
    process.exit(1);
  } else {
    const expressPort = process.env.PORT || 3333;
    httpServer.listen(expressPort, function () {
      console.log(`API Ver: ${version}; Listening on port: ${expressPort}`);
      console.log(
        `Connect Via : http://localhost:${expressPort}/api/${version}`
      );
    });
  }
});
