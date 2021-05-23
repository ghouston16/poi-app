'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/category');
const utils = require('./utils')

const Pois = {
  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const pois = await Poi.find().populate("category").populate("creator");
      console.log(pois);
      return pois;
    }
  },
  findByCategory: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const pois = await Poi.find({ category: request.params.id });
      console.log(pois);
      return pois;
    }
  },
  findById: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const poi = await Poi.find({ _id: request.params._id });
      console.log(poi);
      return poi;
    }
  },
  makePoi: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userId = utils.getUserIdFromRequest(request);
      let poi = new Poi(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      console.log(category);
      if (!category) {
        return Boom.notFound("No Category with this id");
      }
      poi.category = category._id;
      poi.creator = userId;
      poi = await poi.save();
      return poi;
    },
  },
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      await Poi.deleteMany({});
      return { success: true };
    }
  },
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const poi = request.params.id;
      console.log(poi);
      await Poi.deleteOne({_id: request.params.id});
      return { success: true };
    }
  }
};

module.exports = Pois;
