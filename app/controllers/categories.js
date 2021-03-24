'use strict'

const Category = require('../models/category');
const User = require('../models/user');
const AdminStats = require('../utils/adminStats');
const Poi = require('../models/poi');

const Categories = {
  categories: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      console.log(user);
      if (user.isAdmin === true) {
        //  const pois = await Poi.find().populate("creator").lean();
        const categories = await Category.find().populate("name").lean();
        const userTotal = await AdminStats.countUsers();
        console.log(userTotal);
        const poiTotal = await AdminStats.countIslands();
        return h.view("categories", {
          title: "Categories",
          categories: categories,
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
  addCategory: {
    handler: async function(request, h) {
      const payload = request.payload;
      const newCategory = new Category({
        name: payload.name,
      });
      await newCategory.save();
      const categories = Category.find();
      const users = User.find();
      return h.redirect('/userDash', {
        title: 'Dashboard',
        users: users,
        categories: categories,
      });
    }
  },
  editCategory: {
    handler: async function(request, h) {
      const newDetails = request.payload;
      const id = request.params.id;
      const updatedCategory = await Category.findById(id);
      updatedCategory.name = newDetails.name;
      await updatedCategory.save();
      const categories = Category.find();
      const users = User.find();
      return h.redirect('/userDash', {
        title: 'Dashboard',
        users: users,
        categories: categories,
      });
    }
  }
}

module.exports = Categories;