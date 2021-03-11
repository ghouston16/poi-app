"use strict";

const Poi = {
  home: {
    handler: function (request, h) {
      return h.view("home", { title: "Add an Point of Interest" });
    },
  },
  report: {
    handler: function (request, h) {
      return h.view("report", {
        title: "Points of Interest",
        pois: this.pois,
      });
    },
  },
  create: {
    handler: function (request, h) {
      const data = request.payload;
      var creatorEmail = request.auth.credentials.id;
      data.creator = this.users[creatorEmail];
      this.pois.push(data);
      return h.redirect("/report");
    },
  },
};

module.exports = Poi;
