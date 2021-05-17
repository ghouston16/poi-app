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
     // if (user.isAdmin === true) {
        //  const pois = await Poi.find().populate("creator").lean();
        const categories = await Category.find().populate().lean();
        const userTotal = await AdminStats.countUsers();
        const totalCats = await AdminStats.countCategories();
      //  console.log(userTotal);
        const poiTotal = await AdminStats.countIslands();
        return h.view("categories", {
          title: "Categories",
          categories: categories,
          userTotal: userTotal,
          poiTotal: poiTotal,
          totalCats: totalCats
        });
      } /* else {
          //  const pois = await Poi.find().populate("creator").lean();
          const categories = await Category.find({ }).populate().lean();
         // const userTotal = await AdminStats.countUsers();
         // const totalCats = await
         //   console.log(userTotal);
          const poiTotal = await AdminStats.countIslands();
          return h.view("categories", {
            title: "Categories",
            categories: categories,
          //  userTotal: userTotal,
          //  poiTotal: poiTotal,
         //   totalCategories: totalCats
          });
        }
    }, */
  },
  showCategory: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = User.findById(id);
        const categories = await Category.find().lean();
        const category = await Category.findById(request.params._id);
        const catId = category._id;
        console.log(id);
        const users = await User.find().lean();
        if (user.isAdmin === true) {
          const pois = await Poi.find({ creator: id, category: catId }).populate("creator").populate("category").lean();
          return h.view("category-view", { title: "POI Category", pois: pois });
        } else {
          const pois = await Poi.find({ category: catId }).populate("creator").populate("category").lean();
          return h.view("category-view", { title: "POI Category", pois: pois, categories: categories });
        }
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
  },
  showCat: {
    handler: async function(request, h) {
      try {
        const category = await Category.findById(request.params._id).lean();
        const catName = category.name;
        const users = await User.find().lean();
          return h.view("update-category", { title: "Edit Category", category: category });
      } catch (err) {
        return h.view("report", { errors: [{ message: err.message }] });
      }
    }
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
      return h.redirect('/categories', {
        title: 'Categories',
        users: users,
        categories: categories,
      });
    }
  },
  deleteCat: {
    handler: async function(request, h) {
      const category = Category.findById(request.params._id);
      await Category.deleteOne(category);
      const categories = Category.find();
      const users = User.find();
      return h.redirect('/categories', {
        title: 'Categories',
        categories: categories,
      });
    }
  },
  editCategory: {
    handler: async function(request, h) {
      const newDetails = request.payload;
      const id = request.params._id;
      const category = await Category.findById(id);
      category.name = newDetails.name;
      await category.save();
      const categories = Category.find();
      const users = User.find();
      return h.redirect('/categories', {
        title: 'Categories',
        users: users,
        categories: categories,
      });
    }
  }
}

module.exports = Categories;