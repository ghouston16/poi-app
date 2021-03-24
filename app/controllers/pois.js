"use strict";
const Poi = require("../models/poi");
const User = require("../models/user");
const Joi = require("@hapi/joi")
const Image = require("../models/image")
const Boom = require('@hapi/boom');
//const ImageStore = require('../utils/image-store');
//const Gallery = require('../utils/image-store')
const Category = require("../models/category");
const  AdminStats = require('../utils/adminStats.js');
const Pois = {
  home: {
    handler: async function (request, h) {
      const categories = await Category.find().lean();
      return h.view("home", { title: "Add an Point of Interest", categories: categories });
    },
  },
  report: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      console.log(user);
      if (user.isAdmin === true) {
        //  const pois = await Poi.find().populate("creator").lean();
        const categories = await Category.find().lean();
        const pois = await Poi.find().populate("creator").populate("category").lean();
        const userTotal = await AdminStats.countUsers();
        console.log(userTotal);
        const poiTotal = await AdminStats.countIslands();
        return h.view("report", {
          title: "Admin Dash",
          pois: pois,
          userTotal: userTotal,
          poiTotal: poiTotal
        });
      } else {
        //  const pois = await Poi.find().populate("creator").lean();
        const categories = await Category.find().lean();
        const pois = await Poi.find({ creator: id }).populate("creator").populate("category").lean();
        return h.view("report", {
          title: "Points of Interest",
          pois: pois,
        });

      }
    },
  },
  create: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        lat: Joi.string().required(),
        long: Joi.string().required(),
        image: Joi.string().not().required()
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        const categories = await Category.find().lean();
        return h
          .view("home", {
            title: "Sign up error",
            categories: categories,
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      try {
       // const image = ImageStore.uploadImage(imagefile);
        const categories = await Category.find().lean();
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const rawCategory = request.payload.category;
        const category = await Category.findOne({
          name: rawCategory
        });
        const newPoi = new Poi({
          name: data.name,
          description: data.description,
          creator: user._id,
          category: category._id,
          lat: data.lat,
          long: data.long,
          image: data.url
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
        const categories = await Category.find().lean();
        const id = request.params._id;
        console.log(id);
        const poi = await Poi.findById(id).lean();
        return h.view("poiview", { title: "Edit Poi", poi: poi , categories: categories});
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  },
  updatePoi: {
    validate: {
      payload: {
        name: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        lat: Joi.string().required(),
        long: Joi.string().required(),
        image: Joi.string().not().required()
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        const id = request.params._id;
        console.log(id);
        const poi = await Poi.findById(id).lean();
       // const categories = await Category.find().populate("name").lean();
        return h
          .view("poiview", {
            title: "Error",
            errors: error.details,
            poi: poi,
           // categories: categories,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const poiEdit = request.payload;
        const poi = await Poi.findById(request.params._id);
       /* const rawCategory = request.payload.category;
        const category = await Category.findOne({
          name: rawCategory
        });

        */
        console.log(poi);
        poi.name = poiEdit.name;
        poi.description = poiEdit.description;
        poi.category =  poiEdit.category;
        poi.lat = poiEdit.lat;
        poi.long = poiEdit.long;
        poi.image = poiEdit.image;
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
  viewPoi: {
    handler: async function(request, h) {
      try {
        const categories = await Category.find().lean();
        const id = request.params._id;
        console.log(id);
        const poi = await Poi.findById(id).lean();
       // const poicategory = poi.category.name;
        return h.view("view-poi", { title: "Poi View", poi: poi , categories: categories});
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  },
  /*
  showUpload: {
    handler: async function(request, h) {
      try {
        const id = request.params._id;
        console.log(id);
        const poi = await Poi.findById(id).lean();
        return h.view("imagesUpload", { title: "Upload Images", poi: poi });
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  }

   */
};

module.exports = Pois;
