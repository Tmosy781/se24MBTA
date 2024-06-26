const mongoose = require("mongoose");

//user schema/model
const favSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    line: {
      type: String,
      required: false,
    },
    station: {
        type: String,
        required: false,
      },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "favorites" }
);

module.exports = mongoose.model('favorites', favSchema)