"use strict";

const fp = require("fastify-plugin");

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  const cloudinary = require("cloudinary");
  const image = {
    upload: async (params = {}) => {
      // params = {key:'ceylonuni',image:''}
      cloudinary.config({
        cloud_name: fastify.config.CLOULD_NAME,
        api_key: fastify.config.CLOULD_API_KEY,
        api_secret: fastify.config.CLOULD_API_SECRET,
      });

      var url = null;
      await cloudinary.v2.uploader.upload(
        params.image_url,
        { public_id: params.key },
        function (error, result) {
          url = result.url;
        }
      );
      return url;
    },
  };
  fastify.decorate("image", image);
});
