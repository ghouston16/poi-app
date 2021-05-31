'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const Joi = require("@hapi/joi");
const utils = require('./utils.js');
const bcrypt = require("bcrypt");
//const bcrypt = require("bcryptjs")
const saltRounds = 10;                     // ADDED
const Users = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound('No User with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');
      }
    }
  },
  findByEmail: {
    auth: false,
    handler: async function(request, h) {
      try {
        console.log(request.params.email);
        const user = await User.findOne({ email: request.params.email });
        if (!user) {
          return Boom.notFound('No User with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');
      }
    }
  },

  create: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
        lastName: Joi.string().required().regex(/^[A-Z]/).min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5),
      },
    },
    handler: async function(request, h) {
      const newUser = new User(request.payload);
      const storedPassword = newUser.password;
      const hash = await bcrypt.hash(storedPassword, saltRounds);
      const saveUser = new User({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: hash,
      });
      const user = await saveUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('error creating user');
    }
    //  }
  },


  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      await User.deleteMany({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const userId = await utils.getUserIdFromRequest(request);
      //console.log(userId);
      const user = await User.deleteOne({ _id: userId });
      if (user) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },
  getUserId: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const user = await utils.getUserIdFromRequest({request });
      if (user) {
        return user;
      }
      return Boom.notFound('id not found');
    }
  },
  update: {
    auth: {
      strategy: "jwt",
    },
    validate: {
      payload: {
        firstName: Joi.string().required().regex(/^[A-Z][a-z]{2,}$/),
        lastName: Joi.string().required().regex(/^[A-Z]/).min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(5),
      },
    },
    handler: async function (request, h) {
      const userEdit = request.payload;
      const userId = await utils.getUserIdFromRequest(request);
      const storedPassword = userEdit.password;
      const hash = await bcrypt.hash(storedPassword, saltRounds);
      //console.log(userId);
      const user = await User.findById(userId);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      user.password = hash;
      user._id = userId;
      await user.save();
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  authenticate: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        const password = request.payload.password;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (!isMatch) {
          return Boom.unauthorized("Invalid password");
        } else {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },
};

module.exports = Users;
