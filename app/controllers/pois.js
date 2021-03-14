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
  },
  showPoi: {
    handler: async function(request, h) {
      try {
        const id = request.params._id;
        console.log(id);
        const poi = await Poi.findById(id).lean();
        return h.view("poiview", { title: "Edit Poi", poi: poi });
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  },
  updatePoi: {
    handler: async function (request, h) {
      try {
        const poiEdit = request.payload;
        const poi = await Poi.findById(request.params._id);
        console.log(poi);

        // console.log(id);
        poi.name = poiEdit.name;
        poi.description = poiEdit.description;
        console.log("Updated" + poi);
        await poi.save();
        // console.log("Updated" + poi);
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  deletePoi: {
    handler: async function (request, h) {
      const poi = Poi.findById(request.params._id);
      console.log("Removing POI: " + poi.name);
      await poi.remove();
      return h.redirect("/report");
    },
  }, 
};

module.exports = Pois;
