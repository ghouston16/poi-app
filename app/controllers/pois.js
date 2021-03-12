"use strict";
const Poi = require("../models/poi");
const User = require("../models/user");

const Pois = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add an Point of Interest" });
    },
  },
  report: {
    handler: async function (request, h) {
      const pois = await Poi.find().populate("creator").lean();
      return h.view("report", {
        title: "Points of Interest",
        pois: pois,
      });
    },
  },
  create: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const newPoi = new Poi({
          name: data.name,
          description: data.description,
          creator: user._id
        });
        await newPoi.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Pois;
