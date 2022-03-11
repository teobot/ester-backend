const dotenv = require("dotenv").config(),
  config = require("./src/config/config"),
  express = require("./src/config/express"),
  db = require("./src/config/db"),
  version = config.get("version");

const app = express();

db.connect(function (err) {
  if (err) {
    console.log("Unable to connect to MongoDB");
    process.exit(1);
  } else {
    const port = process.env.PORT || 3333;
    app.listen(port, function () {
      console.log(`API Ver: ${version}; Listening on port: ${port}`);
      console.log(`Connect Via : http://localhost:${port}/api/${version}`);
    });
  }
});