const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vote: {
    type: Number,
    default: 0.5,
  },
  voted: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["creator", "user"],
    default: "user",
  },
  color: {
    type: String,
    default: "",
  }
});

// export the schema
mongoose.model(`User`, UserSchema);
