'use strict';

const Category = require('../models/category');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const Categories = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const categories = await Category.find();
      return categories;
    }
  },
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const category = await Category.findOne({ _id: request.params.id });
        if (!category) {
          return Boom.notFound('No Category with this id');
        }
        return category;
      } catch (err) {
        return Boom.notFound('No Category with this id');
      }
    }
  },
  create: {
    auth: {
      strategy: "jwt",
    },
    validate: {
      payload: {
        name: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
      },
    },
    handler: async function(request, h) {
      const newCategory = new Category(request.payload);
      const category = await newCategory.save();
      if (category) {
        return h.response(category).code(201);
      }
      return Boom.badImplementation('error creating category');
    }
  },
  updateOne: {
    auth: {
      strategy: "jwt",
    },

    validate: {
      payload: {
        name: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
        /*
        description: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/).max(240),
        category: Joi.string().not().required(),
        lat: Joi.string().required().max(10),
        long: Joi.string().required().max(10),
        image: Joi.string().not().required()

         */
      },
    },
    handler: async function(request, h) {
      try {
        const categoryEdit = request.payload;
        const category = await Category.findById(request.payload._id);
        console.log(category);
        category.name = categoryEdit.name;
        console.log("Updated" + category);
        await category.save();
        if (category) {
          return { success: true };
        }
      } catch(err){
        return Boom.notFound("id not found");
      }
    },
  },
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      await Category.deleteMany({});
      return { success: true };
    }
  },
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const response = await Category.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }
};

module.exports = Categories;
