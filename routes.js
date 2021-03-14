"use strict";

const Accounts = require("./app/controllers/accounts");
const Pois = require("./app/controllers/pois");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: "GET", path: "/home", config: Pois.home },
  { method: "POST", path: "/create", config: Pois.create },
  { method: "GET", path: "/report", config: Pois.report },
  { method: "GET", path: "/poiview/{_id}", config: Pois.showPoi},
  { method: "POST", path: "/poiview/{_id}", config: Pois.updatePoi },
 // { method: "POST", path: "/report/{_id}", config: Pois.deletePoi },
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
