const Poi = require("../models/poi");
const User = require("../models/user");
const Joi = require("@hapi/joi")
const Image = require("../models/image")
const Boom = require('@hapi/boom');
//const ImageStore = require('../utils/image-store');
//const Gallery = require('../utils/image-store')
const Category = require("../models/category");

const AdminStats = {
  countIslands: async function() {
    const count = await Poi.countDocuments();
      return count;
  },
  countUsers: async function() {
    const count = await User.countDocuments();
    return count;
  },
  countCategories: async function() {
    const count = await Category.countDocuments();
    return count;
  }
  };

module.exports = AdminStats;