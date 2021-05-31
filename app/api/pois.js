'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const Category = require('../models/category');
const utils = require('./utils');
const Joi = require('@hapi/joi');

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
      console.log(request.payload);
      const pois = await Poi.find({ category: request.params.id }).populate("category").populate("creator");
      console.log(pois);
      return pois;
    }
  },
  findById: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const poi = await Poi.findById(request.params.id).populate("creator").populate("category");
      console.log(poi);
      return poi;
    }
  },
  makePoi: {
    auth: {
      strategy: "jwt",
    },

   validate: {
      payload: {
        name: Joi.string().required(), //.regex(/^[A-Z][a-z]{2,}$/),
        description: Joi.string().required(), //.regex(/^[A-Z][a-z]{2,}$/).max(240),
        category: Joi.string().required(),
        lat: Joi.string().required(),
        long: Joi.string().required(),
        image: Joi.string(),
       // creator: Joi.string().required()
      },
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
  },
  updateOne: {
    auth: {
      strategy: "jwt",
    },

    validate: {
      payload: {
        name: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
        description: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/).max(240),
        category: Joi.string().not().required(),
        lat: Joi.string().required().max(10),
        long: Joi.string().required().max(10),
        image: Joi.string().not().required()
      },
    },


    handler: async function(request, h) {
      try {
        const poiEdit = request.payload;
        const poi = await Poi.findById(request.payload._id);
        const rawCategory = request.payload.category;
        const category = await Category.findOne({
          name: rawCategory
        });
        console.log(poi);
        poi.name = poiEdit.name;
        poi.description = poiEdit.description;
        poi.category = poiEdit.category;
        poi.lat = poiEdit.lat;
        poi.long = poiEdit.long;
        poi.creator = poi.creator;
        poi.image = poiEdit.image;
        console.log("Updated" + poi);
        await poi.save();
        if (poi) {
          return { success: true };
        }
      } catch(err){
        return Boom.notFound("id not found");
      }
    },
  },
};

module.exports = Pois;
