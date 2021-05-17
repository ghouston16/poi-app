'use strict';

const ImageStore = require('../utils/image-store');
const Image = require('../models/image');
const Poi = require("../models/poi");


const Gallery = {
  index: {
    handler: async function(request, h) {
      try {
       // const allImages = await ImageStore.getAllImages();
        const rawPoi = request.params._id;
        const poi = await Poi.findOne({
          _id: rawPoi
        });
        const Images = await ImageStore.getAllImages(poi);

        console.log(Images);
       // const poiImages = await ImageStore.getAllImages()
        return h.view('gallery', {
          title: 'POI Gallery',
          images: Images,
          poi: poi.name
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  uploadFile: {
    handler: async function(request, h) {
      try {
        const file = request.payload.imagefile;
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
          return h.redirect('/gallery/' + poi._id);
        }
        return h.view('gallery', {
          title: 'Cloudinary Gallery',
          error: 'No file selected'
        });
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
        await ImageStore.deleteImage(request.params.id);
        return h.redirect('/');
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = Gallery;
