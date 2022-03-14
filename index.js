const dotenv = require("dotenv").config(),
  config = require("./src/config/config"),
  express = require("./src/config/express"),
  db = require("./src/config/db"),
  version = config.get("version"),
  { createServer } = require("http"),
  { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
});

const app = express(io);

db.connect(function (err) {
  if (err) {
    console.log("Unable to connect to MongoDB");
    process.exit(1);
  } else {
    const expressPort = process.env.PORT || 3333;
    const socketPort = process.env.SOCKET_PORT || 8000;
    httpServer.listen(socketPort, function () {
      console.log("Socket server listening on port " + socketPort);
    });
    app.listen(expressPort, function () {
      console.log(`API Ver: ${version}; Listening on port: ${expressPort}`);
      console.log(
        `Connect Via : http://localhost:${expressPort}/api/${version}`
      );
    });
  }
});
