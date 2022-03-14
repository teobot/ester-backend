const config = require("./config.js");

const version = config.get("version");

const { Server } = require("socket.io");

module.exports = function (httpServer) {
  const io = new Server(httpServer, {
    /* options */
    cors: {
      origin: "*",
    },
  });
  return io;
};
