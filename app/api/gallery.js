'use strict';
/*
//const ImageStore = require('../utils/image-store');
const Image = require('../models/image');
const Poi = require("../models/poi");


const Gallery = {
  // Tested on Postman
  // TODO: Write Test
  // TODO: Add Auth
  getImages: {
    auth: false,
    handler: async function(request, h) {
      try {
       // const allImages = await ImageStore.getAllImages();
        const rawPoi = request.params._id;
        console.log(rawPoi);
        const poi = await Poi.findOne({
          _id: rawPoi
        });
        const Images = await ImageStore.getAllImages(poi);
          return Images;
      } catch (err) {
        console.log(err);
      }
    }
  },

  uploadFile: {
    auth: false,
    handler: async function(request, h) {
      try {
        const file = request.payload;
        //const data = request.payload;
        const rawPoi = request.params._id;
        const poi = await Poi.findOne({
          _id: rawPoi
        });
        await ImageStore.uploadImage(request.payload.imagefile, poi);
       // const Images = await Image.find({poi: poi}).lean();
        const Images = await ImageStore.getAllImages(poi);
        if (Object.keys(file).length > 0) {
          //  await image.url;
        //  poi.images.push(Images);
          poi.name = poi.name;
          poi.description = poi.description;
          poi.category =  poi.category;
          poi.lat = poi.lat;
          poi.long = poi.long;
          poi.images = Images;
          poi.save();
          if (poi) {
            return { success: true };
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true,
    //  poi: poi,
    }
  },
  deleteImage: {
    handler: async function(request, h) {
      try {
       // const image = await Image.findById(request.params._id)
        const images = await ImageStore.deleteImage(request.params._id);
        if (images) {
          return { success: true };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = Gallery;
*/