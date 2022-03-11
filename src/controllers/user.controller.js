var jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  // TODO - create a new user
  try {
    return res.send("create a new user");
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

module.exports = {
  createUser,
};
