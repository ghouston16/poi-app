"use strict";

const Boom = require('@hapi/boom');
const User = require('../models/user');
const Joi = require("@hapi/joi");
const Image = require('../models/image');
const AdminStats = require('../utils/adminStats');
const Category = require('../models/category');
const Poi = require('../models/poi');
const bcrypt = require("bcrypt");          // ADDED
const saltRounds = 10;                     // ADDED

const Accounts = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to POI's" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Sign up for POI's" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
        lastName: Joi.string().required().regex(/^[A-Z]/).min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        const hash = await bcrypt.hash(payload.password, saltRounds);
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
          isAdmin: false
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/report");
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login to POI's" });
    },
  },
  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view("settings", { title: "User Settings", user: user });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
        lastName: Joi.string().required().regex(/^[A-Z]/).min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("settings", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        const hash = await bcrypt.hash(userEdit.password, saltRounds);    // ADDED
        user.password = hash;          // CHANGED
        await user.save();
        console.log(user);
        return h.redirect("/settings");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  deleteAccount: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      console.log(id);
      await User.deleteOne(user);
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  },
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("login", {
            title: "Login Error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }
        await user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        if (user.isAdmin === true){
          return h.redirect("/report")
        }
        return h.redirect("/home");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
 /* userlist: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      console.log(user);
      if (user.isAdmin === true) {
        //  const pois = await Poi.find().populate("creator").lean();
        // const categories = await Category.find().lean();
        const users = await User.find().populate("firstName").populate("lastName").populate("email").lean();
        const userTotal = await AdminStats.countUsers();
        console.log(userTotal);
        const poiTotal = await AdminStats.countIslands();
        const totalCats = await AdminStats.countCategories();
        return h.view("report", {
          title: "Admin POI's",
          userTotal: userTotal,
          poiTotal: poiTotal,
          users: users
        });
      } else {
        //  const pois = await Poi.find().populate("creator").lean();
        return h.view("home", {
          title: "Points of Interest",
        });

      }
    },
  }

  */
  };
  module.exports = Accounts;
