"use strict";

const Accounts = require("./app/controllers/accounts");
const Pois = require("./app/controllers/pois");
//const Gallery = require('./app/controllers/gallery');
const Categories = require('./app/controllers/categories')
module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  { method: 'GET', path: '/deleteUser/{_id}', config: Accounts.deleteAccount },

  { method: "GET", path: "/home", config: Pois.home },
  { method: "POST", path: "/create", config: Pois.create },
  { method: "GET", path: "/report", config: Pois.report },
  { method: "GET", path: "/poiview/{_id}", config: Pois.showPoi},
  { method: "POST", path: "/poiview/{_id}", config: Pois.updatePoi },
  { method: "GET", path: "/delete-poi/{_id}", config: Pois.deletePoi },
  { method: "GET", path: "/view-poi/{_id}", config: Pois.viewPoi },

 // { method: 'GET', path: '/gallery/{_id}', config: Gallery.index },
 // { method: 'POST', path: '/uploadfile/{_id}', config: Gallery.uploadFile },
 // { method: 'GET', path: '/deleteimage/{_id}', config: Gallery.deleteImage },

  { method: "GET", path: "/categories", config: Categories.categories },
  { method: "GET", path: "/category-view/{_id}", config: Categories.showCategory },
  { method: 'POST', path: '/add-cat', config: Categories.addCategory },
  { method: "GET", path: "/delete-category/{_id}", config: Categories.deleteCat },
  { method: 'GET', path: '/update-category/{_id}', config: Categories.showCat },
  { method: 'POST', path: '/update-category/{_id}', config: Categories.editCategory },

  //{ method: 'GET', path: '/deleteimage/{id}', config: Gallery.deleteImage },
  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
