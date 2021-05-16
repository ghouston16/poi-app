'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/category');

const Pois = {
  findAll: {
    auth: false,
    handler: async function(request, h) {
      const pois = await Poi.find();
      return pois;
    }
  },
  findByCategory: {
    auth: false,
    handler: async function(request, h) {
      const pois = await Poi.find({ category: request.params.id });
      return pois;
    }
  },
  makePoi: {
    auth: false,
    handler: async function(request, h) {
      let poi = new Poi(request.payload);
      const category = await Category.findOne({ _id: request.params.id });
      if (!category) {
        return Boom.notFound('No Category with this id');
      }
      poi.category = category._id;
      poi = await poi.save();
      return poi;
    }
  },
  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await Poi.deleteMany({});
      return { success: true };
    }
  }
};

module.exports = Pois;
