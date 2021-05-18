"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: String,
  rating: Number,
  review: String,
  poi: {
    type: Schema.Types.ObjectId,
    ref: 'Poi',
  },
});

module.exports = Mongoose.model("Image",reviewSchema)