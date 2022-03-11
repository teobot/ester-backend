# Documentation
## Adding a new route
1. Create the routes file using the boilerplate code below in the folder `./src/routes`.
```javascript
const config = require("../config/config");

const version = config.get("version");

const controller = require("../controllers/CONTROLLER_NAME");

module.exports = function (app) {

  // This route creates a game and returns a joinable url and admin access token.
  app.route("/api/" + version + "/ROUTE_SLUG").get(controller.CONTROLLER_FUNCTION);
};
```
2. Then Create the controller in the folder `./src/controllers` using the boilerplate code.
```javascript
// Require config
const config = require("../config/config");

// Import JWT
var jwt = require('jsonwebtoken');

// CreateGame function creates a yoinked game when triggered.
const CONTROLLER_FUNCTION = (req, res) => {
  return res.send({ message: "Hello World!" });
};

// export all functions
module.exports = {
  CONTROLLER_FUNCTION,
};
```
3. Add the route file in the directory: `./src/config/express.js` add the route file using the code below.
```javascript
require("../routes/ROUTE_FILE")(app);
```
## Creating a new mongoose schema
1. Make the new model using the code below and save it inside `./src/models/` using convention `name.model.js`,
```javascript
const mongoose = require("mongoose");

const SCHEMA_NAME = new mongoose.Schema({});

mongoose.model(`MODEL_NAME`, SCHEMA_NAME);
```
2. Add the import inside `./src/config/db.js` at the top of the page, using the code `require("../models/name.model")`

### Adding new value to model
1. Add the key and value to the model located inside `./src/models/`,
2. Go to `./src/controllers/database.controller.js` and add the new value to be saved to the database inside `saveReviewToDatabase`,