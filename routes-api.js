const Categories = require('./app/api/categories');
const Users = require('./app/api/users');
const Pois = require('./app/api/pois');
//const Gallery = require('./app/api/gallery');

module.exports = [
  { method: 'GET', path: '/api/categories', config: Categories.find },
  { method: 'GET', path: '/api/categories/{id}', config: Categories.findOne },
  { method: 'POST', path: '/api/categories', config: Categories.create },
  { method: 'DELETE', path: '/api/categories/{id}', config: Categories.deleteOne },
  { method: 'DELETE', path: '/api/categories', config: Categories.deleteAll },
   { method: "PUT", path: "/api/categories/{id}", config: Categories.updateOne },

  { method: 'GET', path: '/api/users', config: Users.find },
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
  { method: 'GET', path: '/api/useremail', config: Users.findByEmail },
  { method: 'POST', path: '/api/users', config: Users.create },
  { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
  { method: 'DELETE', path: '/api/users', config: Users.deleteAll },
  { method: "PUT", path: "/api/users/{id}", config: Users.update },
  //{ method: "POST", path: "/api/users/authenticate", config: Users.authenticate },
  { method: 'POST', path: '/api/users/authenticate', config: Users.authenticate },

  { method: 'GET', path: '/api/pois', config: Pois.findAll },
  { method: 'GET', path: '/api/pois/{id}', config: Pois.findById },
  { method: "PUT", path: "/api/pois/{id}", config: Pois.updateOne },

  { method: 'GET', path: '/api/categories/{id}/pois', config: Pois.findByCategory },

  { method: 'POST', path: '/api/categories/{id}/pois', config: Pois.makePoi },
  { method: 'DELETE', path: '/api/pois', config: Pois.deleteAll },
  { method: 'DELETE', path: '/api/pois/{id}', config: Pois.deleteOne },

 // { method: 'GET', path: '/api/gallery/{_id}', config: Gallery.getImages },
  //{ method: 'POST', path: '/api/uploadfile/{_id}', config: Gallery.uploadFile },
];
