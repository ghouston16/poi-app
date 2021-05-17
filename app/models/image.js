"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  poi: {
    type: Schema.Types.ObjectId,
    ref: 'Poi',
  },
});

module.exports = Mongoose.model("Image", imageSchema)