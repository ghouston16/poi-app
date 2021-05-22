'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/category');

const Pois = {
  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const pois = await Poi.find();
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
  makePoi: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userId = utils.getUserIdFromRequest(request);
      let poi = new Poi(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category) {
        return Boom.notFound("No Category with this id");
      }
      poi.category = category._id;
      poi.donor = userId;
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
  }
};

module.exports = Pois;
